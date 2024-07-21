import type { AstroConfig, AstroIntegration } from "astro";
import vitePluginSimpleScope from "vite-plugin-simple-scope";

import "../ambient.d.ts";

type VitePlugin = Required<AstroConfig["vite"]>["plugins"][number];

export default function simpleStackQueryIntegration(): AstroIntegration {
	return {
		name: "simple-stack-query",
		hooks: {
			"astro:config:setup"({ updateConfig }) {
				updateConfig({
					vite: {
						plugins: [vitePlugin(), vitePluginSimpleScope()],
					},
				});
			},
		},
	};
}

function vitePlugin(): VitePlugin {
	return {
		name: "simple-stack-query",
		transform(code, id) {
			const [baseId, search] = id.split("?");
			if (!baseId?.endsWith(".astro")) return;

			const isAstroFrontmatter = !search;

			if (isAstroFrontmatter) {
				return `
      import { scope } from 'simple:scope';
      const $ = scope;\n${code}`;
			}

			const searchParams = new URLSearchParams(search);
			if (!searchParams.has("lang.ts")) return;

			return `
    import { scope } from 'simple:scope';
    import * as __queryInternals from "simple-stack-query/internal";
		import { transitionEnabledOnThisPage } from "astro:transitions/client";

    const $ = __queryInternals.create$(scope);
    const ready = __queryInternals.createReady(scope, transitionEnabledOnThisPage());\n${code}`;
		},
	};
}
