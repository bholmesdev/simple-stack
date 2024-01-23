import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(async ({ locals }, next) => {
	locals.stream = {
		components: [],
	};
	let response = await next();
	if (!response.headers.get("content-type")?.startsWith("text/html")) {
		return response;
	}

	async function* render() {
		// @ts-expect-error ReadableStream does not have asyncIterator
		for await (let chunk of response.body) {
			yield chunk;
		}
		for (let [idx, component] of locals.stream.components.entries()) {
			yield `<template data-suspense-id=${JSON.stringify(
				idx,
			)}>${await component}</template>
<script>
	const template = document.querySelector(\`template[data-suspense-id="${idx}"]\`).content;
	const dest = document.querySelector(\`simple-suspense[data-suspense-id="${idx}"]\`);
	dest.replaceWith(template);
</script>`;
		}
	}

	// @ts-expect-error generator not assignable to ReadableStream
	return new Response(render(), response.headers);
});
