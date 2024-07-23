// Sample effect implementation from signal-polyfill:
// https://github.com/proposal-signals/signal-polyfill?tab=readme-ov-file#creating-a-simple-effect

import { Signal } from "signal-polyfill";

let needsEnqueue = true;

const w = new Signal.subtle.Watcher(() => {
	if (needsEnqueue) {
		needsEnqueue = false;
		queueMicrotask(processPending);
	}
});

function processPending() {
	needsEnqueue = true;

	for (const s of w.getPending()) {
		s.get();
	}

	w.watch();
}

export type MaybePromise<T> = T | Promise<T>;
export type CleanupCallback = () => MaybePromise<void>;

export function effect(
	callback: () => MaybePromise<undefined | CleanupCallback>,
	opts?: { signal: AbortSignal },
) {
	let cleanup: undefined | CleanupCallback;

	const computed = new Signal.Computed(async () => {
		typeof cleanup === "function" && (await cleanup());
		cleanup = await callback();
	});

	w.watch(computed);
	computed.get();

	opts?.signal?.addEventListener(
		"abort",
		() => {
			w.unwatch(computed);
			typeof cleanup === "function" && cleanup();
			cleanup = undefined;
		},
		{ once: true },
	);
}
