import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

export default defineConfig({
	site: "https://simple-stack.dev",
	integrations: [
		starlight({
			title: "Simple Stack 🌱",
			head: [
				// Open Graph
				{
					tag: "meta",
					attrs: { property: "og:type", content: "website" },
				},
				{
					tag: "meta",
					attrs: { property: "og:site_name", content: "Simple Stack" },
				},
				{
					tag: "meta",
					attrs: { property: "og:locale", content: "en_US" },
				},
				// Twitter Card
				{
					tag: "meta",
					attrs: { name: "twitter:card", content: "summary" },
				},
				// JSON-LD: WebSite + Organization
				{
					tag: "script",
					attrs: { type: "application/ld+json" },
					content: JSON.stringify({
						"@context": "https://schema.org",
						"@graph": [
							{
								"@type": "WebSite",
								name: "Simple Stack",
								url: "https://simple-stack.dev",
								description:
									"Lightweight developer tools for Astro, React, and Vite. Includes a reactive store, scoped IDs, and DOM query utilities.",
							},
							{
								"@type": "Organization",
								name: "Simple Stack",
								url: "https://simple-stack.dev",
								sameAs: [
									"https://github.com/bholmesdev/simple-stack",
								],
							},
						],
					}),
				},
			],
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/bholmesdev/simple-stack",
				},
				{ icon: "discord", label: "Discord", href: "https://wtw.dev/chat" },
			],
			sidebar: [
				{
					label: "💾 Store",
					link: "/store",
				},
				{
					label: "🔎 Scope",
					link: "/scope",
				},
				{
					label: "💰 Query",
					link: "/query",
				},
				{
					label: "🌊 Stream",
					link: "/stream",
					badge: { text: "Deprecated", variant: "caution" },
				},
				{
					label: "🧘‍♂️ Form",
					autogenerate: { directory: "form" },
					collapsed: true,
					badge: { text: "Deprecated", variant: "caution" },
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
