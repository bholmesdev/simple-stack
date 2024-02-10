type PendingThenableState = { status: "pending" };
type FulfilledThenableState<T> = { status: "fulfilled"; value: T };
type RejectedThenableState = { status: "rejected"; reason: unknown };

type ThenableState<T> =
	| PendingThenableState
	| FulfilledThenableState<T>
	| RejectedThenableState;

export type Thenable<T> = Promise<T> & ThenableState<T>;

export function trackPromiseState<T>(promise: Promise<T>): Thenable<T> {
	const thenable = promise as Promise<T> & PendingThenableState;
	thenable.status = "pending";
	thenable.then(
		(value) => {
			const fulfilled = promise as Promise<T> & FulfilledThenableState<T>;
			fulfilled.status = "fulfilled";
			fulfilled.value = value;
		},
		(error) => {
			const rejected = promise as Promise<T> & RejectedThenableState;
			rejected.status = "rejected";
			rejected.reason = error;
		}
	);
	return thenable;
}

export type PromiseController<T> = ReturnType<
	typeof promiseWithResolvers<T>
>[1];

export function promiseWithResolvers<T>() {
	let resolve: (value: T) => void = undefined!;
	let reject: (error: unknown) => void = undefined!;
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	return [promise, { resolve, reject }] as const;
}

export function sleep(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
