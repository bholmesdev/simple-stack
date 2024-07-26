import type { scope as scopeFn } from "simple:scope";
import type {
	MaybePromise,
	CleanupCallback,
	effect as effectFn,
} from "./effect.js";
import {
	transitionEnabledOnThisPage,
	getFallback,
} from "astro/virtual-modules/transitions-router.js";

type ReadyCallback = (
	$: any,
	context: {
		effect: typeof effectFn;
		data: any;
		abortSignal: AbortSignal;
	},
) => MaybePromise<undefined | CleanupCallback>;

export function createRootElement(scope: typeof scopeFn) {
	function mountReadyCallback(callback: ReadyCallback) {
		const roots = document.querySelectorAll(
			`simple-query-root[data-scope-hash=${JSON.stringify(scope())}]`,
		);
		for (const root of roots) {
			(root as any).ready(callback);
		}
	}
	return {
		ready(callback: ReadyCallback) {
			if (transitionEnabledOnThisPage() && getFallback() !== "none") {
				document.addEventListener("astro:page-load", () => {
					mountReadyCallback(callback);
				});
			} else {
				mountReadyCallback(callback);
			}
		},
	};
}

export function createRootElementClass(
	effect: typeof effectFn = () => {
		throw new Error(
			"Unable to call `effect()`. To use this function, install the `signal-polyfill` package.",
		);
	},
) {
	return class extends HTMLElement {
		#cleanupCallback?: CleanupCallback;

		#abortController = new AbortController();
		abortSignal = this.#abortController.signal;

		disconnectedCallback() {
			this.#cleanupCallback?.();
			this.#abortController.abort();
		}

		async ready(callback: ReadyCallback) {
			const scopeHash = this.getAttribute("data-scope-hash")!;
			const stringifiedData = this.getAttribute("data-stringified")!;
			const $ = create$(this, (prefix) =>
				prefix ? `${prefix}-${scopeHash}` : scopeHash,
			);
			const data = JSON.parse(stringifiedData);

			this.#cleanupCallback = await callback($, {
				effect: effect.bind({ signal: this.abortSignal }),
				data,
				abortSignal: this.abortSignal,
			});
		}
	};
}

function create$(self: HTMLElement, scope: typeof scopeFn) {
	function getSelector(scopeId: string) {
		return `[data-target=${JSON.stringify(scope(scopeId))}]`;
	}
	function $(scopeId: string) {
		const selector = getSelector(scopeId);
		const element = self.querySelector(selector);
		if (!element) throw new Error(`Element not found: ${selector}`);
		return element;
	}
	Object.assign($, {
		self,
		optional(scopeId: string) {
			const selector = getSelector(scopeId);
			return self.querySelector(selector) ?? undefined;
		},
		all(scopeId: string) {
			const selector = getSelector(scopeId);
			return [...self.querySelectorAll(selector)];
		},
	});
	return $;
}
