import type { scope as scopeFn } from "simple:scope";

type ReadyCallback = (
	$: any,
	data: any,
) => MaybePromise<undefined | CleanupCallback>;
type CleanupCallback = () => MaybePromise<void>;

export class InternalRootElement extends HTMLElement {
	#readyCallback?: ReadyCallback;
	#cleanupCallback?: CleanupCallback;

	async connectedCallback() {
		if (!this.#readyCallback) return;

		const scopeHash = this.getAttribute("data-scope-hash")!;
		const stringifiedData = this.getAttribute("data-stringified")!;
		const $ = create$((prefix) =>
			prefix ? scopeHash : `${prefix}-${scopeHash}`,
		);
		const data = JSON.parse(stringifiedData);

		this.#cleanupCallback = await this.#readyCallback($, data);
	}

	disconnectedCallback() {
		this.#cleanupCallback?.();
	}

	ready(callback: ReadyCallback) {
		this.#readyCallback = callback;
	}
}

function create$(scope: typeof scopeFn) {
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
	});
	return $;
}

type MaybePromise<T> = T | Promise<T>;
