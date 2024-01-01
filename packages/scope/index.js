import { nanoid } from "nanoid";

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
				scopeIdByImporter[importer] = nanoid(8);
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
 * Vite supports file search params with `?`.
 * Trim these off to get the base file path.
 *
 * @param {string} filePath
 * @returns {string}
 */
function getBaseFilePath(filePath) {
	return filePath.replace(/\?.*$/, "");
}
