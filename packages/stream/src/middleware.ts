import { defineMiddleware } from "astro:middleware";

type SuspendedChunk = {
	chunk: string;
	idx: number;
};

export const onRequest = defineMiddleware(async (ctx, next) => {
	let streamController: ReadableStreamDefaultController<SuspendedChunk>;

	// Thank you owoce!
	// https://gist.github.com/lubieowoce/05a4cb2e8cd252787b54b7c8a41f09fc
	const stream = new ReadableStream<SuspendedChunk>({
		start(controller) {
			streamController = controller;
		},
	});

	let curId = 0;
	const pending = new Set<Promise<string>>();

	ctx.locals.suspend = (promise) => {
		const idx = curId++;
		pending.add(promise);
		promise
			.then((chunk) => {
				try {
					streamController.enqueue({ chunk, idx });
				} finally {
					pending.delete(promise);
				}
			})
			.catch((e) => {
				streamController.error(e);
			});
		return idx;
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

		if (!pending.size) return streamController.close();

		yield `<script>window.__SIMPLE_SUSPENSE_INSERT = function (idx) {
	var template = document.querySelector('[data-suspense="' + idx + '"]').content;
	var dest = document.querySelector('[data-suspense-fallback="' + idx + '"]');
	dest.replaceWith(template);
}</script>`;

		// @ts-expect-error ReadableStream does not have asyncIterator
		for await (const { chunk, idx } of stream) {
			yield `<template data-suspense=${idx}>${chunk}</template>` +
				`<script>window.__SIMPLE_SUSPENSE_INSERT(${idx});</script>`;
			if (!pending.size) return streamController.close();
		}
	}

	// @ts-expect-error generator not assignable to ReadableStream
	return new Response(render(), response.headers);
});
