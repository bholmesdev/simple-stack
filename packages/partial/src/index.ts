import type { AstroIntegration } from "astro";

export default function partial(): AstroIntegration {
	return {
		name: "simple-partial",
		hooks: {},
	};
}
