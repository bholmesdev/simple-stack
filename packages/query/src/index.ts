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
      import { scope as __scope } from 'simple:scope';
      const $ = __scope;\n${code}`;
			}

			const searchParams = new URLSearchParams(search);
			if (!searchParams.has("lang.ts")) return;

			return `
    import { scope as __scope } from 'simple:scope';
    import * as __queryInternals from "simple-stack-query/internal";

    const $ = __queryInternals.create$(__scope);
    const ready = __queryInternals.createReady(__scope);\n${code}`;
		},
	};
}
