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
		}),
	],
});
