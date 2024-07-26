import type { scope as scopeFn } from "simple:scope";
import type {
	MaybePromise,
	CleanupCallback,
	effect as effectFn,
} from "./effect.js";
import { transitionEnabledOnThisPage } from "astro/virtual-modules/transitions-router.js";

function getFallback(): string {
	const el = document.querySelector('[name="astro-view-transitions-fallback"]');
	if (el) {
		return el.getAttribute("content") as string;
	}
	return "animate";
}

type ReadyCallback = (
	$: any,
	context: {
		effect: typeof effectFn;
		data: any;
		abortSignal: AbortSignal;
	},
) => MaybePromise<undefined | CleanupCallback>;

/**
 * It's possible for RootElements to stream in after `ready()` is called.
 * This is true for in-order streaming and server islands.
 * Track callbacks in a Map by the RootElement id that function expects.
 *
 * Q: Can we every remove from this map for memory optimization?
 * A: (@bholmesdev) I don't think so.
 * It's possible for one `ready()` function to belong to multiple instances
 * of a component, so it's unclear how we could empty this map overtime.
 */
const readyCallbacksByRootHash = new Map<string, ReadyCallback>();

export function createRootElement(scope: typeof scopeFn) {
	function mountReadyCallback(callback: ReadyCallback) {
		readyCallbacksByRootHash.set(scope(), callback);
		const roots = document.querySelectorAll(
			`simple-query-root[data-scope-hash=${JSON.stringify(scope())}]`,
		);
		for (const root of roots) {
			// It's possible for a RootElement's `connectedCallback`
			// to fire before the user's `ready()` function is registered.
			// Call `connectedCallback` again to retry.
			if (root.isConnected) {
				(root as any).connectedCallback();
			}
		}
	}
	return {
		ready(callback: ReadyCallback) {
			if (transitionEnabledOnThisPage() || getFallback() !== "none") {
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

		async connectedCallback() {
			const scopeHash = this.getAttribute("data-scope-hash")!;
			const callback = readyCallbacksByRootHash.get(scopeHash);
			if (!callback) return;

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

		disconnectedCallback() {
			this.#cleanupCallback?.();
			this.#abortController.abort();
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
