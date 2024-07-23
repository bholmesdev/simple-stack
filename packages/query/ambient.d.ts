declare function $(selector: string): string;

declare namespace RootElement {
	function ready<T extends Record<string, any>>(
		callback: (
			$: {
				<T extends Element = HTMLElement>(selector: string): T;
				all<T extends Element = HTMLElement>(selector: string): Array<T>;
				optional<T extends Element = HTMLElement>(
					selector: string,
				): T | undefined;
			},
			data: T,
		) => void,
	);
	function effect(callback: (() => Promise<void>) | (() => void)): void;
}

declare function RootElement<T extends Record<string, any>>(
	result: any,
	props: T,
	slots: never,
): any | Promise<any>;
