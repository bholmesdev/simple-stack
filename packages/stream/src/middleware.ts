import { defineMiddleware } from "astro/middleware";

export const onRequest = defineMiddleware(({ request, locals }, next) => {
	locals.stream = {
		_internal: {
			components: new Map(),
		},
	};

	return next();
});
