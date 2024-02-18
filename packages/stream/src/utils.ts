import { AsyncLocalStorage } from "node:async_hooks";

export const sleep = (ms: number) =>
	new Promise((resolve) => setTimeout(resolve, ms));

export const SuspenseStorage = new AsyncLocalStorage<{
	id: number;
}>();
