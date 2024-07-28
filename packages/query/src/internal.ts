import type { scope as scopeFn } from "simple:scope";
import type {
	CleanupCallback,
	MaybePromise,
	effect as effectFn,
} from "./effect.js";

type ReadyCallback = (
	$: any,
	context: {
		effect: typeof effectFn;
		data: any;
		abortSignal: AbortSignal;
	},
) => MaybePromise<undefined | CleanupCallback>;

export function createRootElement(
	scope: typeof scopeFn,
	effect: typeof effectFn = () => {
		throw new Error(
			"Unable to call `effect()`. To use this function, install the `signal-polyfill` package.",
		);
	},
) {
	return {
		ready(callback: ReadyCallback) {
			window.customElements.define(
				`simple-query-root-${scope()}`,
				createRootElementClass(scope, effect, callback),
			);
		},
	};
}

export function createRootElementClass(
	scope: typeof scopeFn,
	effect: typeof effectFn,
	readyCallback: ReadyCallback,
) {
	return class extends HTMLElement {
		#cleanupCallback?: CleanupCallback;

		#abortController = new AbortController();
		abortSignal = this.#abortController.signal;

		async connectedCallback() {
			const stringifiedData = this.getAttribute("data-stringified")!;
			const $ = create$(this, scope);
			const data = JSON.parse(stringifiedData);

			this.#cleanupCallback = await readyCallback($, {
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
