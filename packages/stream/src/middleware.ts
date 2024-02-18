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

const FLUSH_THRESHOLD = 50;

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

	/** Track suspense boundaries for parent <> child flattening */
	const claimableChunks = new Set<{
		id: number;
		parentId: number;
		chunk: string;
	}>();

	ctx.locals.suspend = async (promiseCb) => {
		const id = curId++;

		// Pass `id` as context while rendering child content.
		// This lets us track the parent from nested suspense calls.
		const basePromise = SuspenseStorage.run({ id }, promiseCb);

		const parentId = SuspenseStorage.getStore()?.id;
		const parentPromise =
			parentId !== undefined ? pending.get(parentId) : undefined;

		const promise = new Promise<string>((resolve) => {
			// Await the parent before resolving the child.
			// This ensures the parent is sent to the client first.
			const parent = parentPromise ?? Promise.resolve();
			parent.then(() => resolve(basePromise));
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
				const claimable = { id, parentId: parentId ?? -1, chunk: baseChunk };
				claimableChunks.add(claimable);

				// Wait to see if child promises resolve quickly.
				// If they do, we will flatten, or "flush,"
				// to avoid unnecessary fallbacks.
				await sleep(FLUSH_THRESHOLD);

				let chunk = baseChunk;
				const children = [...claimableChunks].filter((c) => c.parentId === id);

				for (const child of children) {
					chunk = chunk.replace(
						new RegExp(
							`${fallbackMarkerStart(child.id)}.*?${fallbackMarkerEnd(
								child.id,
							)}`,
							"s",
						),
						child.chunk,
					);
					pending.delete(child.id);
					claimableChunks.delete(child);
				}
				streamController.enqueue({ chunk, id });
				claimableChunks.delete(claimable);
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
