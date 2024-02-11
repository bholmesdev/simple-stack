import { defineMiddleware } from "astro:middleware";
import {
	createSuspenseResponse,
	type SuspenseGlobalCtx,
} from "./suspense-context";

type SuspendedChunk = {
	id: number;
	chunk: string;
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

	const suspenseCtx: SuspenseGlobalCtx = createSuspenseResponse({
		onBoundaryReady(chunk, boundary) {
			const { id } = boundary;
			console.log("middleware :: enqueuing", id);
			streamController.enqueue({ chunk, id });
		},
		onBoundaryErrored(error: unknown) {
			streamController.error(error);
		},
		onAllReady() {
			return streamController.close();
		},
	});

	ctx.locals.suspense = suspenseCtx;

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

		if (!suspenseCtx.pending.size) return streamController.close();

		console.log(`middleware :: ${suspenseCtx.pending.size} chunks pending`);
		if (!suspenseCtx.pending.size) return streamController.close();

		yield BOOTSTRAP_SCRIPT;

		// @ts-expect-error ReadableStream does not have asyncIterator
		for await (const item of stream) {
			const { id, chunk } = item as SuspendedChunk;
			console.log("middleware :: yielding", id, chunk);
			yield asyncChunkInsertionHTML(id, chunk);
		}
	}

	// @ts-expect-error generator not assignable to ReadableStream
	return new Response(render(), response.headers);
});

const BOOTSTRAP_SCRIPT = `<script>
window.__SIMPLE_SUSPENSE_INSERT = function (id) {
	var template = document.querySelector('[data-suspense="' + id + '"]').content;
	var dest = document.querySelector('[data-suspense-fallback="' + id + '"]');
	dest.replaceWith(template);
}
</script>`;

function asyncChunkInsertionHTML(id: number, chunk: string) {
	return (
		`<template data-suspense=${id}>${chunk}</template>` +
		`<script>window.__SIMPLE_SUSPENSE_INSERT(${id});</script>`
	);
}
