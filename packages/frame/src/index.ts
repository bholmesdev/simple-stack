import { addDts, addVirtualImports } from "astro-integration-kit";
import { AstroIntegration } from "astro";

const name = "simple:frame";

export default function simpleFrame(): AstroIntegration {
	return {
		name,
		hooks: {
			"astro:config:setup": (params) => {
				addVirtualImports(params, {
					name,
					imports: {
						"simple:frame": `export * from 'simple-stack-frame/components';
export * from 'simple-stack-frame/module';`,
					},
				});
				addDts(params, {
					name,
					content: `declare module "simple:frame" {
export * from "simple-stack-frame/components";
export * from "simple-stack-frame/module";
}`,
				});
				params.injectScript("page", 'import "simple-stack-frame/client";');
				params.updateConfig({
					vite: {
						define: {
							"import.meta.env.PAGES_DIR": JSON.stringify(
								new URL("src/pages", params.config.root).href,
							),
						},
					},
				});
			},
		},
	};
}
