import { AsyncLocalStorage } from "node:async_hooks";
import {
	promiseWithResolvers,
	type PromiseController,
	type Thenable,
	trackPromiseState,
	sleep,
} from "./utils";

type GenericBoundary<T> = {
	id: number;
	thenable: Thenable<T>;
	controller: PromiseController<T>;
};

type BoundaryResult = null | string | (() => string);
export type Boundary = GenericBoundary<BoundaryResult>;

export type SuspenseGlobalCtx = ReturnType<typeof createSuspenseResponse>;

export type SuspenseStorageCtx = {
	parentId: number;
	ancestorIds: number[];
};

export const SuspenseStorage = new AsyncLocalStorage<SuspenseStorageCtx>();

export function createSuspenseResponse({
	onAsyncChunkReady,
	onAllReady,
	onBoundaryErrored,
}: {
	onAsyncChunkReady: (chunk: string, boundary: Boundary) => void;
	onBoundaryErrored: (error: unknown, boundary: Boundary) => void;
	onAllReady: () => void;
}) {
	return {
		curId: 1,
		getBoundaryId() {
			return this.curId++;
		},
		boundaries: new Map<number, Boundary>(),
		pending: new Set<number>(),
		flushed: new Set<number>(),

		batches: new Map<number, Batch>(),
		getOrCreateNextBatch({
			boundaryId,
			ancestorIds,
			duration,
		}: {
			boundaryId: number;
			ancestorIds: number[] | undefined;
			duration: number;
		}) {
			// check if we have an ongoing batch, starting from the outermost ancestor
			const ancerstorWithBatch = ancestorIds?.find((ancestorId) =>
				this.batches.has(ancestorId)
			);
			const existingBatch =
				ancerstorWithBatch !== undefined
					? this.batches.get(ancerstorWithBatch)
					: undefined;

			if (!existingBatch) {
				const initiatorId = boundaryId;
				const newBatch: Batch = createBatch({ duration, initiatorId });
				newBatch.deadline.then(() => {
					this.batches.delete(initiatorId);
				});
				this.batches.set(initiatorId, newBatch);
				return [newBatch, true] as const;
			} else {
				return [existingBatch, false] as const;
			}
		},

		children: new Map<number, Set<number>>(),
		addChild(parentId: number, childId: number) {
			const edges = getOrCreate(
				this.children,
				parentId,
				() => new Set<number>()
			);
			edges.add(childId);
			return edges;
		},

		getBoundary(id: number) {
			return getOrCreate(this.boundaries, id, () => {
				const [promise, controller] = promiseWithResolvers<BoundaryResult>();
				return { id, thenable: trackPromiseState(promise), controller };
			});
		},
		addBoundary(id: number, parentId?: number): Boundary {
			if (this.boundaries.has(id)) {
				throw new Error(
					`simple-suspense :: internal error: duplicate boundary id ${id}`
				);
			}
			this.pending.add(id);
			const boundary = this.getBoundary(id);
			if (parentId !== undefined) {
				if (!this.boundaries.has(parentId)) {
					throw new Error(
						`simple-suspense :: internal error: nonexistent parent id ${parentId}`
					);
				}
				this.addChild(parentId, id);
			}

			// TODO: is this the right place to do this?
			boundary.thenable.catch((error) => {
				onBoundaryErrored(error, boundary);
			});

			return boundary;
		},

		flushes: new Map<number, GenericBoundary<void>>(),
		getOrCreateFlush(id: number) {
			return getOrCreate(this.flushes, id, () => {
				const [promise, controller] = promiseWithResolvers<void>();
				return { id, controller, thenable: trackPromiseState(promise) };
			});
		},
		onFlushed(id: number, callback: () => void) {
			const { thenable } = this.getOrCreateFlush(id);
			return thenable.then(callback);
		},
		markFlushed(id: number) {
			this.pending.delete(id);
			this.flushed.add(id);
			const { controller } = this.getOrCreateFlush(id);
			controller.resolve();
		},

		markEmittedSync(boundary: Boundary) {
			const { id } = boundary;
			console.log(`boundary was emitted synchronously ${id}`);
			this.markFlushed(id);
			boundary.controller.resolve(null);
		},

		emitAsync(boundary: Boundary, chunk: string) {
			const { id } = boundary;
			boundary.controller.resolve(chunk);
			if (this.flushed.has(id)) {
				console.error("tried to emitAsync a boundary that already flushed");
				return;
			}
			console.log(
				"middleware :: boundary resolved",
				id,
				chunk === null ? null : chunk.slice(0, 16) + "..."
			);
			this.markFlushed(id);
			try {
				if (chunk !== null) {
					onAsyncChunkReady(chunk, boundary);
				}
			} finally {
				if (!this.pending.size) {
					onAllReady();
				}
			}
		},
	};
}

type Batch = {
	deadline: Promise<void>;
	isFinished: boolean;
	initiatorId: number;
	collect(): Promise<void>;
	register(): () => void;
	registered: Promise<void>[];
};

function createBatch({
	initiatorId,
	duration,
}: {
	initiatorId: number;
	duration: number;
}): Batch {
	const deadline = sleep(duration);
	return {
		deadline,
		isFinished: false,
		initiatorId,
		registered: [],
		register() {
			if (this.isFinished) {
				throw new Error(
					`Internal error: Cannot register into a finished batch`
				);
			}
			const [promise, { resolve }] = promiseWithResolvers<void>();
			this.registered.push(promise);
			return resolve;
		},
		async collect() {
			await deadline;
			console.log("batch :: deadline passed", this.registered.length);
			this.isFinished = true;
			await Promise.all(this.registered);
			console.log("batch :: collect resolving", this.registered.length);
		},
	};
}

function getOrCreate<K, V>(map: Map<K, V>, key: K, create: () => V): V {
	let value = map.get(key);
	if (!value && !map.has(key)) {
		value = create();
		map.set(key, value);
	}
	return value!;
}
