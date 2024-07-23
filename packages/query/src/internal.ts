import type { scope as scopeFn } from "simple:scope";
import { effect, type MaybePromise, type CleanupCallback } from "./effect.js";

type ReadyCallback = (
	$: any,
	data: any,
) => MaybePromise<undefined | CleanupCallback>;

export function createRootElement(scope: typeof scopeFn) {
	const roots = document.querySelectorAll(
		`simple-query-root[data-scope-hash=${JSON.stringify(scope())}]`,
	);
	return {
		ready(callback: ReadyCallback) {
			for (const root of roots) {
				(root as any).ready(callback);
			}
		},
		effect(callback: ReadyCallback) {
			for (const root of roots) {
				(root as any).effect(callback);
			}
		},
	};
}

export function createRootElementClass() {
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

			this.#cleanupCallback = await callback($, data);
		}

		effect(callback: () => MaybePromise<undefined | CleanupCallback>) {
			effect(callback, { signal: this.abortSignal });
		}
	};
}

function create$(parent: HTMLElement, scope: typeof scopeFn) {
	function getSelector(scopeId: string) {
		return `[data-target=${JSON.stringify(scope(scopeId))}]`;
	}
	function $(scopeId: string) {
		const selector = getSelector(scopeId);
		const element = parent.querySelector(selector);
		if (!element) throw new Error(`Element not found: ${selector}`);
		return element;
	}
	Object.assign($, {
		optional(scopeId: string) {
			const selector = getSelector(scopeId);
			return parent.querySelector(selector) ?? undefined;
		},
		all(scopeId: string) {
			const selector = getSelector(scopeId);
			return [...parent.querySelectorAll(selector)];
		},
	});
	return $;
}
