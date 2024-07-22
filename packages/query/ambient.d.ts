declare function $<T extends Element = HTMLElement>(selector: string): T;

declare namespace $ {
	function all<T extends Element = HTMLElement>(selector: string): Array<T>;
	function optional<T extends Element = HTMLElement>(
		selector: string,
	): T | undefined;
	function ready(callback: () => void): void;
}
