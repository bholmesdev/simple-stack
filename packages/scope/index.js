import { createHash } from "node:crypto";
import { normalizePath } from "vite";

const virtualMod = "simple:scope";

/** @returns {import('vite').Plugin} */
export default function simpleScope() {
	/** @type {Record<string, string>} */
	const scopeIdByImporter = {};

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

/**
 * @param {string} filename
 * @returns {string}
 */
function createScopeHash(filename) {
	return createHash("shake256", { outputLength: 4 })
		.update(normalizeFilename(filename))
		.digest("hex");
}

/**
 * @param {string} filename
 * @returns {string}
 */
function normalizeFilename(filename) {
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
 *
 * @param {string} filePath
 * @returns {string}
 */
function getBaseFilePath(filePath) {
	return filePath.replace(/\?.*$/, "");
}
