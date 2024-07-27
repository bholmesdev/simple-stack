/// <reference path="../ambient.d.ts" />

import { mkdir, writeFile } from "node:fs/promises";
import type { AstroConfig, AstroIntegration } from "astro";
import { cyan } from "kleur/colors";
import vitePluginSimpleScope from "vite-plugin-simple-scope";
import { createRequire } from "node:module";

import { existsSync } from "node:fs";

type VitePlugin = Required<AstroConfig["vite"]>["plugins"][number];

type Options = {
	bypassSnippetsPrompt?: boolean;
};

export default function simpleStackQueryIntegration(
	opts?: Options,
): AstroIntegration {
	let root: URL;
	let command: "dev" | "build" | "preview";
	return {
		name: "simple-stack-query",
		hooks: {
			"astro:server:start": async () => {
				if (command === "dev" && !opts?.bypassSnippetsPrompt) {
					setTimeout(() => {
						addSnippets({ root });
					}, 100);
				}
			},
			async "astro:config:setup"(params) {
				root = params.config.root;
				command = params.command;

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

async function addSnippets({ root }: { root: URL }) {
	const dotAstroDir = new URL(".astro/", root);
	const snippetsResponseFile = new URL(
		"simple-query-snippets-response",
		dotAstroDir,
	);
	if (existsSync(snippetsResponseFile)) return;

	const { confirm, isCancel, outro } = await import("@clack/prompts");
	const shouldAddSnippets = await confirm({
		message:
			"Simple query offers snippets for VS Code. Would you like to add them?",
	});

	if (isCancel(shouldAddSnippets)) process.exit(0);

	await mkdir(dotAstroDir, { recursive: true });
	await writeFile(snippetsResponseFile, shouldAddSnippets ? "true" : "false");

	if (!shouldAddSnippets) {
		outro(`No problem! Won't ask again. ${cyan("Dev server running.")}`);
		return;
	}

	const vsCodeDir = new URL(".vscode/", root);
	const vsCodeSnippetsFile = new URL("simple-query.code-snippets", vsCodeDir);

	await mkdir(vsCodeDir, { recursive: true });
	await writeFile(
		vsCodeSnippetsFile,
		JSON.stringify(
			{
				"query target": {
					prefix: "$:target",
					body: ["data-target={$('$1')}"],
				},
				"query ready block": {
					scope: "typescript,javascript",
					prefix: "$:ready",
					body: ["$.ready(async () => {", "  $1", "});"],
				},
			},
			null,
			2,
		),
	);
	outro(`Snippets added ✔️\n   ${cyan("Dev server running.")}`);
}
