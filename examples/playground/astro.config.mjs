import { defineConfig } from "astro/config";
import simpleStackForm from "simple-stack-form";
import simpleStackStream from "simple-stack-stream";
import react from "@astrojs/react";
import node from "@astrojs/node";
import preact from "@astrojs/preact";
import solidJs from "@astrojs/solid-js";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
	output: "server",
	integrations: [
		simpleStackForm(),
		simpleStackStream(),
		react({ include: ["**/react/*"] }),
		preact({ include: ["**/preact/*"] }),
		solidJs({ include: ["**/solid-js/*"] }),
		tailwind(),
	],
	adapter: node({
		mode: "standalone",
	}),
});
