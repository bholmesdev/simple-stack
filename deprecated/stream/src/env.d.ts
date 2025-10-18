/// <reference types="astro/client" />

declare namespace App {
	interface Locals {
		suspend(promiseCb: () => Promise<string>): Promise<
			| {
					render: "fallback";
					id: number;
			  }
			| {
					render: "content";
					value: string;
			  }
		>;
	}
}
