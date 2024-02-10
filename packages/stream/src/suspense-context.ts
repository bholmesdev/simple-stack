import { AsyncLocalStorage } from "node:async_hooks";
import {
	promiseWithResolvers,
	type PromiseController,
	type Thenable,
	trackPromiseState,
} from "./utils";

type GenericBoundary<T> = {
	id: number;
	thenable: Thenable<T>;
	controller: PromiseController<T>;
};

export type Boundary = GenericBoundary<string | null>;

// export type SuspenseGlobalCtx = {
// 	pending: Set<number>;
// 	dependencies: Map<number, Set<number>>;
// 	curId: number;
// 	getBoundaryId(): number;
// 	boundaries: Map<number, Boundary>;
// 	getBoundary(id: number): Boundary;
// 	addBoundary(id: number, parentId?: number): Boundary;
// };

export type SuspenseGlobalCtx = ReturnType<typeof createSuspenseResponse>;

export function createSuspenseResponse({
	onBoundaryReady,
	onAllReady,
	onBoundaryErrored,
}: {
	onBoundaryReady: (chunk: string, boundary: Boundary) => void;
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
		pings: {
			flushed: new Map<number, GenericBoundary<void>>(),
		},
		dependencies: new Map<number, Set<number>>(),
		addDependency(idFrom: number, idTo: number) {
			let edges = this.dependencies.get(idFrom);
			if (!edges) {
				edges = new Set();
				this.dependencies.set(idFrom, edges);
			}
			edges.add(idTo);
			return edges;
		},
		getBoundary(id: number) {
			return getOrCreate(this.boundaries, id, () => {
				const [promise, controller] = promiseWithResolvers<string | null>();
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
				this.addDependency(parentId, id);
			}

			// TODO: is this the right place to do this?
			boundary.thenable.catch((error) => {
				onBoundaryErrored(error, boundary);
			});

			return boundary;
		},

		markEmittedSync(boundary: Boundary) {
			const { id } = boundary;
			console.log(`boundary was emitted synchronously ${id}`);
			this.flushed.add(id);
			this.pending.delete(id);
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
			try {
				if (chunk !== null) {
					onBoundaryReady(chunk, boundary);
				}
			} finally {
				this.pending.delete(id);
				this.flushed.add(id);
				if (!this.pending.size) {
					onAllReady();
				}
			}
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

export type SuspenseStorageCtx = {
	parentId: number;
	ancestorIds: number[];
	// registerBoundary(id: number, promise: Promise<string>): number;
};

export const SuspenseStorage = new AsyncLocalStorage<SuspenseStorageCtx>();
