import { defineIntegration } from "astro-integration-kit";
import {
	addDtsPlugin,
	addVirtualImportsPlugin,
} from "astro-integration-kit/plugins";

export default defineIntegration({
	name: "simple:frame",
	plugins: [addDtsPlugin, addVirtualImportsPlugin],
	setup() {
		return {
			"astro:config:setup"({
				addVirtualImports,
				addDts,
				config,
				injectScript,
				updateConfig,
			}) {
				addVirtualImports({
					"simple:frame": `export * from 'simple-stack-frame/components';
export * from 'simple-stack-frame/module';`,
				});
				addDts({
					name: "simple:frame",
					content: `declare module "simple:frame" {
	export * from "simple-stack-frame/components";
	export * from "simple-stack-frame/module";
}`,
				});
				injectScript("page", 'import "simple-stack-frame/client";');
				updateConfig({
					vite: {
						define: {
							"import.meta.env.PAGES_DIR": JSON.stringify(
								new URL("src/pages", config.root).href,
							),
						},
					},
				});
			},
		};
	},
});
