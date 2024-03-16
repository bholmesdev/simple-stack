import type { AstroIntegration } from "astro";

const VIRTUAL_MOD_ID = "simple:form";
const RESOLVED_VIRTUAL_MOD_ID = "\0" + VIRTUAL_MOD_ID;

export type Options = {
	injectMiddleware?: true | false;
};

export default function integration(opts?: Options): AstroIntegration {
	return {
		name: "simple-form",
		hooks: {
			"astro:config:setup"({ addMiddleware, updateConfig }) {
				const shouldInjectMiddleware: boolean = opts?.injectMiddleware ?? true;
				if (shouldInjectMiddleware) {
					addMiddleware({
						entrypoint: "simple-stack-form/middleware",
						order: "pre",
					});
				}

				updateConfig({
					vite: {
						plugins: [
							{
								name: "simple:form",
								resolveId(id) {
									if (id === VIRTUAL_MOD_ID) {
										return RESOLVED_VIRTUAL_MOD_ID;
									}
								},
								load(id) {
									if (id === RESOLVED_VIRTUAL_MOD_ID) {
										return `export * from 'simple-stack-form/module';`;
									}
								},
							},
						],
					},
				});
			},
		},
	};
}
