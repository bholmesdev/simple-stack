import { createHash } from "node:crypto";
import type { AstroConfig } from 'astro'
import { normalizePath } from "vite";

type VitePlugin = Required<AstroConfig['vite']>['plugins'][number];

import "../ambient.d.ts";

const virtualMod = "simple:scope";

export default function vitePluginSimpleScope(): VitePlugin {
	const scopeIdByImporter: Record<string, string> = {};

	return {
		name: "vite-plugin-simple-scope",
		resolveId(id, rawImporter) {
			if (id !== virtualMod || !rawImporter) return;

			const importer = getBaseFilePath(rawImporter);
			if (!scopeIdByImporter[importer]) {
				scopeIdByImporter[importer] = createScopeHash(importer);
			}
			return `${virtualMod}/${scopeIdByImporter[importer]}`;
		},
		async load(id) {
			const [maybeVirtualMod, scopeId] = id.split("/");
			if (maybeVirtualMod !== virtualMod || !scopeId) return;

			return `const scopeId = ${JSON.stringify(scopeId)};
export function scope(id) {
    if (!id) return scopeId;

    return id + '-' + scopeId;
}`;
		},
	};
}

function createScopeHash(filename: string) {
	return createHash("shake256", { outputLength: 4 })
		.update(normalizeFilename(filename))
		.digest("hex");
}

function normalizeFilename(filename: string) {
	const normalizedFilename = normalizePath(filename);
	const normalizedRoot = normalizePath(process.cwd());
	if (normalizedFilename.startsWith(normalizedRoot)) {
		return normalizedFilename.slice(normalizedRoot.length - 1);
	}

	return normalizedFilename;
}

/**
 * Vite supports file search params with `?`.
 * Trim these off to get the base file path.
 */
function getBaseFilePath(filePath: string) {
	return filePath.replace(/\?.*$/, "");
}
