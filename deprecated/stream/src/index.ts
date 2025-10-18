import type { AstroIntegration } from "astro";

export default function integration(): AstroIntegration {
	return {
		name: "simple-stream",
		hooks: {
			"astro:config:setup"({ addMiddleware }) {
				addMiddleware({
					entrypoint: "simple-stack-stream/middleware",
					order: "pre",
				});
			},
		},
	};
}
