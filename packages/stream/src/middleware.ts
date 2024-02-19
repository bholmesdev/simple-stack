import {
	SuspenseStorage,
	fallbackMarkerEnd,
	fallbackMarkerStart,
	sleep,
} from "./utils.js";
import { defineMiddleware } from "astro:middleware";

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

	let curId = 0;
	const pending = new Map<number, Promise<string>>();
	const suspendedChunks = new Map<number, string>();
	const ancestors = new Map<number, number>();

	function getRootId(id: number) {
		let rootId = id;
		while (ancestors.has(rootId)) {
			rootId = ancestors.get(rootId)!;
		}
		return rootId;
	}

	function flushSuspendedChunk({ id, chunk }: SuspendedChunk) {
		const parentId = SuspenseStorage.getStore()?.id;
		if (parentId !== undefined) {
			ancestors.set(id, parentId);
		}
		const rootId = getRootId(id);
		if (rootId === id) {
			suspendedChunks.set(id, chunk);
			// Send the chunk after a delay to allow
			// nested suspense boundaries to flush.
			setTimeout(() => {
				streamController.enqueue({ id, chunk: suspendedChunks.get(id)! });
				suspendedChunks.delete(id);
			}, FLUSH_THRESHOLD);
			return;
		}

		const flushedChunk = suspendedChunks.get(rootId)?.replace(
			new RegExp(
				// Replace fallbacks with resolved content.
				`${fallbackMarkerStart(id)}.*?${fallbackMarkerEnd(id)}`,
				"s",
			),
			chunk,
		);
		if (flushedChunk) {
			pending.delete(id);
			suspendedChunks.set(rootId, flushedChunk);
		} else {
			// Root was already sent to the client.
			// Enqueue to resolve the child via client JS.
			streamController.enqueue({ id, chunk });
		}
	}

	ctx.locals.suspend = async (promiseCb) => {
		const id = curId++;

		// Pass `id` as context while rendering child content.
		// This lets us track the parent from nested suspense calls.
		const basePromise = SuspenseStorage.run({ id }, promiseCb);

		const parentId = SuspenseStorage.getStore()?.id;
		const parentPromise =
			parentId !== undefined ? pending.get(parentId) : undefined;

		const promise = new Promise<string>((resolve) => {
			if (!parentPromise) {
				resolve(basePromise);
				return;
			}
			// Await the parent before resolving the child.
			// This ensures the parent is sent to the client first.
			parentPromise.then(() => resolve(basePromise));
		});
		pending.set(id, promise);

		// Render content without a fallback if resolved quickly.
		const child = await Promise.race([promise, sleep(FLUSH_THRESHOLD)]);

		if (typeof child === "string") {
			pending.delete(id);
			return { render: "content", value: child };
		}

		promise
			.then(async (baseChunk) => {
				flushSuspendedChunk({ id, chunk: baseChunk });
			})
			.catch((e) => {
				streamController.error(e);
			});

		return { render: "fallback", id };
	};

	const response = await next();

	// ignore non-HTML responses
	if (!response.headers.get("content-type")?.startsWith("text/html")) {
		return response;
	}

	async function* render() {
		// @ts-expect-error ReadableStream does not have asyncIterator
		for await (const chunk of response.body) {
			yield chunk;
		}

		// Immediately close the stream if Suspense was not used.
		if (!pending.size) return streamController.close();

		yield `<script>window.__SIMPLE_SUSPENSE_INSERT = function (idx) {
	var template = document.querySelector('[data-suspense="' + idx + '"]').content;
	var dest = document.querySelector('[data-suspense-fallback="' + idx + '"]');
	dest.replaceWith(template);
}</script>`;

		// @ts-expect-error ReadableStream does not have asyncIterator
		for await (const { chunk, id } of stream) {
			yield `<template data-suspense=${id}>${chunk}</template>` +
				`<script>window.__SIMPLE_SUSPENSE_INSERT(${id});</script>`;

			pending.delete(id);
			if (!pending.size) return streamController.close();
		}
	}

	// @ts-expect-error generator not assignable to ReadableStream
	return new Response(render(), response.headers);
});
