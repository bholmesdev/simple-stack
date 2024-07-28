declare namespace RootElement {
	function ready<T extends Record<string, any>>(
		callback: (
			$: {
				<T extends Element = HTMLElement>(selector: string): T;
				self: HTMLElement;
				all<T extends Element = HTMLElement>(selector: string): Array<T>;
				optional<T extends Element = HTMLElement>(
					selector: string,
				): T | undefined;
			},
			context: {
				effect: (callback: () => void | Promise<void>) => void;
				data: T;
				abortSignal: AbortSignal;
			},
		) => void,
	);
}

declare function RootElement<T extends Record<string, any>>(
	props: import("astro/types").HTMLAttributes<"div"> & { data?: T },
): any | Promise<any>;
