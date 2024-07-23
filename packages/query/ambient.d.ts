declare function $(selector: string): string;

declare function RootElement(
	result: any,
	props: RootElementData,
	slots: never,
): any | Promise<any>;

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
}
