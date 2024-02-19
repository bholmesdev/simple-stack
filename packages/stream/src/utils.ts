import { AsyncLocalStorage } from "node:async_hooks";

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const SuspenseStorage = new AsyncLocalStorage<{
	id: number;
}>();

export function fallbackMarkerStart(id: number) {
	return `<!--fallback-start-${id}-->`;
}

export function fallbackMarkerEnd(id: number) {
	return `<!--fallback-end-${id}-->`;
}
