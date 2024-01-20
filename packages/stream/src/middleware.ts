import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(({ request, locals }, next) => {
	locals.stream = {
		components: [],
	};

	return next();
});
