type PendingThenableState = { status: "pending" };
type FulfilledThenableState<T> = { status: "fulfilled"; value: T };
type RejectedThenableState = { status: "rejected"; reason: unknown };

type ThenableState<T> =
	| PendingThenableState
	| FulfilledThenableState<T>
	| RejectedThenableState;

export type Thenable<T> = Promise<T> & ThenableState<T>;

export function trackThenableState<T>(promise: Promise<T>): Thenable<T> {
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
		},
	);
	return thenable;
}

export function sleep(ms: number) {
	return new Promise<void>((resolve) => setTimeout(resolve, ms));
}
