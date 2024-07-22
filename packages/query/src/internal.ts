import type { scope as scopeFn } from "simple:scope";
import {
	transitionEnabledOnThisPage,
	supportsViewTransitions,
} from "astro/virtual-modules/transitions-router.js";

export function create$(scope: typeof scopeFn) {
	const anyMatchSelector = `[data-target$=${JSON.stringify(scope())}`;
	function hasScopeElement() {
		return Boolean(document.querySelector(anyMatchSelector));
	}
	function getSelector(scopeId: string) {
		return `[data-target=${JSON.stringify(scope(scopeId))}]`;
	}
	function $(scopeId: string) {
		const selector = getSelector(scopeId);
		const element = document.querySelector(selector);
		if (!element) throw new Error(`Element not found: ${selector}`);
		return element;
	}
	Object.assign($, {
		optional(scopeId: string) {
			const selector = getSelector(scopeId);
			return document.querySelector(selector) ?? undefined;
		},
		all(scopeId: string) {
			const selector = getSelector(scopeId);
			return [...document.querySelectorAll(selector)];
		},
		ready(callback: () => MaybePromise<undefined | (() => void)>) {
			if (supportsViewTransitions && transitionEnabledOnThisPage()) {
				let cleanup: (() => void) | undefined;

				document.addEventListener("astro:page-load", async () => {
					if (cleanup) cleanup();
					if (!hasScopeElement()) return;

					cleanup = await callback();
				});
			} else {
				if (!hasScopeElement()) return;
				callback();
			}
		},
	});
	return $;
}

type MaybePromise<T> = T | Promise<T>;
