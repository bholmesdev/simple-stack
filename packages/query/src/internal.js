/**
 * Create $ function based on scope.
 * @param {(id: string) => string} scope
 */
export function create$(scope) {
	function getSelector(scopeId) {
		return `[data-target=${JSON.stringify(scope(scopeId))}]`;
	}
	function $(scopeId) {
		const element = document.querySelector(getSelector(scopeId));
		if (!element) throw new Error(`Element not found: ${selector}`);
		return element;
	}
	Object.assign($, {
		optional(scopeId) {
			const selector = getSelector(scopeId);
			return document.querySelector(selector) ?? undefined;
		},
		all(scopeId) {
			const selector = getSelector(scopeId);
			return [...document.querySelectorAll(selector)];
		},
	});
	return $;
}

/**
 * Create ready function based on scope.
 * @param {(id: string) => string} scope
 * @param {boolean} transitionEnabledOnThisPage
 */
export function createReady(scope, transitionEnabledOnThisPage) {
	const selector = `[data-target$=${JSON.stringify(scope())}`;
	function hasScopeElement() {
		return Boolean(document.querySelector(selector));
	}

	return function ready(callback) {
		if (transitionEnabledOnThisPage) {
			let cleanup;

			document.addEventListener("astro:page-load", async () => {
				if (cleanup) cleanup();
				if (!hasScopeElement()) return;

				cleanup = await callback();
			});
		} else {
			if (!hasScopeElement()) return;
			callback();
		}
	};
}
