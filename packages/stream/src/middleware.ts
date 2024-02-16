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

		yield SCRIPT_START;

		// @ts-expect-error ReadableStream does not have asyncIterator
		for await (const { chunk, idx } of stream) {
			yield `insert(${idx}, ${JSON.stringify(chunk)});`;

			if (!pending.size) return streamController.close();
		}

		yield SCRIPT_END;
	}

	// @ts-expect-error generator not assignable to ReadableStream
	return new Response(render(), response.headers);
});

const SCRIPT_START = `<script>{
	let range = new Range();
	let insert = (id, content) => {
		let fragment = range.createContextualFragment(content);
		let selector = '[data-suspense-fallback="' + id + '"]';
		let replacer = () => {
			fallback = document.querySelector(selector);
	
			if (fallback) {
				fallback.replaceWith(fragment);
			} else if (id-- > 0) {
				queueMicrotask(replacer);
			} else {
				console.error(errormsg);
			}
		};
		let errormsg = "Failed to insert async content (Suspense boundary id: " + id + ")";
		let fallback;
	
		replacer();
	};
	
	range.selectNodeContents(document.createElement('template'));
`.replace(/[\n\t]/g, '');

const SCRIPT_END = `}</script>`
