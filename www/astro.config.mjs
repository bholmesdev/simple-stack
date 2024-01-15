import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";

export default defineConfig({
	integrations: [
		starlight({
			title: "Simple Stack 🌱",
			social: {
				github: "https://github.com/bholmesdev/simple-stack",
				discord: "https://wtw.dev/chat",
			},
			sidebar: [
				{
					label: "🧘‍♂️ Form",
					autogenerate: { directory: "form" },
				},
				{
					label: "🔎 Scope",
					link: "/scope",
				},
				{
					label: "🌊 Stream",
					link: "/stream",
				},
				{
					label: "⏳ Partial",
					link: "/partial",
					badge: {
						text: "WIP",
						variant: "caution",
					},
				},
			],
			customCss: [
				"@fontsource/atkinson-hyperlegible/400.css",
				"@fontsource/atkinson-hyperlegible/700.css",
				"./src/styles/custom.css",
			],
		}),
	],
});
