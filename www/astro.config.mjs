import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

// Canonical site URL — required for sitemap, canonical links,
// and the absolute URLs Starlight emits in Open Graph/Twitter meta.
const SITE_URL = "https://simple-stack.dev";

// Site-wide structured data (Organization) for AEO / AI citations.
// Helps ChatGPT, Perplexity, Gemini, and Google AI Overviews
// disambiguate the project as an entity.
const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Simple Stack",
	url: SITE_URL,
	logo: `${SITE_URL}/favicon.svg`,
	description:
		"Simple Stack is a suite of small, focused open-source tools for Astro and Vite that simplify common web development workflows.",
	sameAs: [
		"https://github.com/bholmesdev/simple-stack",
		"https://wtw.dev/chat",
	],
};

export default defineConfig({
	site: SITE_URL,
	integrations: [
		starlight({
			title: "Simple Stack 🌱",
			description:
				"A suite of small, focused tools for Astro and Vite. Includes Simple Store, Simple Scope, and Simple Query — built to simplify your workflow.",
			social: [
				{
					icon: "github",
					label: "GitHub",
					href: "https://github.com/bholmesdev/simple-stack",
				},
				{ icon: "discord", label: "Discord", href: "https://wtw.dev/chat" },
			],
			head: [
				{
					tag: "script",
					attrs: { type: "application/ld+json" },
					content: JSON.stringify(organizationJsonLd),
				},
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
		sitemap(),
	],
});
