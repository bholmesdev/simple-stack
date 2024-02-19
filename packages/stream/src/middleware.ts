import {
	SuspenseStorage,
	fallbackMarkerEnd,
	fallbackMarkerStart,
	sleep,
} from "./utils.js";
import { defineMiddleware } from "astro:middleware";
import { ReadableStream } from "node:stream/web";

type SuspendedChunk = {
	chunk: string;
	id: number;
};

const FLUSH_THRESHOLD = 20;

export const onRequest = defineMiddleware(async (ctx, next) => {
	let streamController: ReadableStreamDefaultController<SuspendedChunk>;

	// Thank you owoce for the ReadableStream idea ;)
	// https://gist.github.com/lubieowoce/05a4cb2e8cd252787b54b7c8a41f09fc
	const stream = new ReadableStream<SuspendedChunk>({
		start(controller) {
			streamController = controller;
		},
	});

	/** Incrementing ID for each suspense boundary */
	let curId = 0;
	/** Map of all suspense promises in-flight by ID */
	const pendingChunks = new Map<number, Promise<string>>();
	/** Map of suspense content waiting to be sent by ID */
	const flushableChunks = new Map<number, string>();
	/** Map from child suspense boundaries to parents by ID */
	const ancestors = new Map<number, number>();

	ctx.locals.suspend = async (promiseCb) => {
		const id = curId++;

		// Pass `id` as context while rendering child content.
		// This lets us track the parent from nested suspense calls.
		const basePromise = SuspenseStorage.run({ id }, promiseCb);

		const parentId = SuspenseStorage.getStore()?.id;
		const parentPromise =
			parentId !== undefined ? pendingChunks.get(parentId) : undefined;

		const promise = new Promise<string>((resolve) => {
			if (!parentPromise) {
				resolve(basePromise);
				return;
			}
			// Await the parent before resolving the child.
			// This ensures the parent is sent to the client first.
			parentPromise.then(() => resolve(basePromise));
		});
		pendingChunks.set(id, promise);

		// Render content without a fallback if resolved quickly.
		const child = await Promise.race([promise, sleep(FLUSH_THRESHOLD)]);

		if (typeof child === "string") {
			pendingChunks.delete(id);
			return { render: "content", value: child };
		}

		promise
			.then(async (chunk) => {
				const parentId = SuspenseStorage.getStore()?.id;
				if (parentId !== undefined) {
					ancestors.set(id, parentId);
				}
				const rootId = getRootId(id);
				if (rootId === id) {
					flushableChunks.set(id, chunk);
					// Briefly wait for any children to resolve before sending parent.
					// This allows the child to render its content server-side
					// rather than sending a fallback to resolve client-side.
					// The React team calls this server-side resolution "flushing."
					setTimeout(() => {
						const flushedChunk = flushableChunks.get(id) ?? chunk;
						streamController.enqueue({ id, chunk: flushedChunk });
						flushableChunks.delete(id);
					}, FLUSH_THRESHOLD);
					return;
				}

				const flushableChunk = flushableChunks.get(rootId);
				if (flushableChunk) {
					// Parent has not been sent to the client yet.
					// Replace the fallback with the child content.
					flushableChunks.set(
						rootId,
						flushableChunk.replace(
							new RegExp(
								`${fallbackMarkerStart(id)}.*?${fallbackMarkerEnd(id)}`,
								"s",
							),
							chunk,
						),
					);
					pendingChunks.delete(id);
				} else {
					// Parent was already sent to the client.
					// Enqueue to render the child client-side.
					streamController.enqueue({ id, chunk });
				}
			})
			.catch((e) => {
				streamController.error(e);
			});

		return { render: "fallback", id };
	};

	/** Walk up the ancestor tree to find the root suspense boundary */
	function getRootId(id: number) {
		let rootId = id;
		while (ancestors.has(rootId)) {
			rootId = ancestors.get(rootId)!;
		}
		return rootId;
	}

	const response = await next();

	// ignore non-HTML responses
	if (!response.headers.get("content-type")?.startsWith("text/html")) {
		return response;
	}

	async function* render() {
		for await (const chunk of response.body as ReadableStream<ArrayBuffer>) {
			yield chunk;
		}

		// Immediately close the stream if Suspense was not used.
		if (!pendingChunks.size) return streamController.close();

		// Send a script to query for the fallback and replace with content.
		// This is grouped into a global __SIMPLE_SUSPENSE_INSERT
		// to reduce the payload size for multiple suspense boundaries.
		yield `<script>window.__SIMPLE_SUSPENSE_INSERT = function (idx) {
	var template = document.querySelector('[data-suspense="' + idx + '"]').content;
	var dest = document.querySelector('[data-suspense-fallback="' + idx + '"]');
	dest.replaceWith(template);
}</script>`;

		for await (const { chunk, id } of stream) {
			yield `<template data-suspense=${id}>${chunk}</template>` +
				`<script>window.__SIMPLE_SUSPENSE_INSERT(${id});</script>`;

			pendingChunks.delete(id);
			if (!pendingChunks.size) return streamController.close();
		}
	}

	// @ts-expect-error generator not assignable to ReadableStream
	return new Response(render(), response.headers);
});
