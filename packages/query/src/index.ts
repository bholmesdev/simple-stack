/// <reference path="../ambient.d.ts" />

import { createRequire } from "node:module";
import type { AstroConfig, AstroIntegration } from "astro";
import vitePluginSimpleScope from "vite-plugin-simple-scope";

type VitePlugin = Required<AstroConfig["vite"]>["plugins"][number];

export default function simpleStackQueryIntegration(): AstroIntegration {
	return {
		name: "simple-stack-query",
		hooks: {
			async "astro:config:setup"(params) {
				params.updateConfig({
					vite: {
						plugins: [
							vitePlugin({ root: params.config.root }),
							vitePluginSimpleScope(),
						],
					},
				});
			},
		},
	};
}

const dataTargetRegex = /data-target="(.*?)"/g;

function vitePlugin({ root }: { root: URL }): VitePlugin {
	return {
		name: "simple-stack-query",
		transform(code, id) {
			const [baseId, search] = id.split("?");
			if (!baseId?.endsWith(".astro")) return;

			const isAstroFrontmatter = !search;

			if (isAstroFrontmatter) {
				const codeWithTargetsReplaced = code.replace(
					dataTargetRegex,
					(_, target) => {
						return `data-target=\${__scope(${JSON.stringify(target)})}`;
					},
				);
				return `
      import { scope as __scope } from 'simple:scope';
			import * as __internals from 'simple-stack-query/internal.server';

			const RootElement = __internals.createRootElement(__scope);\n${codeWithTargetsReplaced}`;
			}

			const searchParams = new URLSearchParams(search);
			if (!searchParams.has("lang.ts")) return;

			return `
    import { scope as __scope } from 'simple:scope';
    import * as __internals from "simple-stack-query/internal";
		${hasSignalPolyfill(root) ? `import { effect as __effect } from "simple-stack-query/effect";` : "const __effect = undefined;"}

		const RootElement = __internals.createRootElement(__scope, __effect);\n${code}`;
		},
	};
}

function hasSignalPolyfill(root: URL) {
	const require = createRequire(root);
	try {
		require.resolve("signal-polyfill");
		return true;
	} catch {
		return false;
	}
}
