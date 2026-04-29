import sitemap from "@astrojs/sitemap";
import starlight from "@astrojs/starlight";
import { defineConfig } from "astro/config";

const SITE_URL = "https://simple-stack.dev";

// Site-wide JSON-LD describing the project as an Organization.
// Helps AI engines (ChatGPT, Perplexity, Google AI Overviews) attribute
// citations and disambiguate the brand.
const organizationJsonLd = {
	"@context": "https://schema.org",
	"@type": "Organization",
	name: "Simple Stack",
	url: SITE_URL,
	logo: `${SITE_URL}/favicon.svg`,
	description:
		"Simple Stack is a suite of small, focused tools for Astro and modern web frameworks, including Simple Store, Simple Scope, and Simple Query.",
	sameAs: [
		"https://github.com/bholmesdev/simple-stack",
		"https://wtw.dev/chat",
	],
};

export default defineConfig({
	site: SITE_URL,
	trailingSlash: "ignore",
	integrations: [
		starlight({
			title: "Simple Stack 🌱",
			description:
				"Simple Stack is a suite of small, focused tools for Astro: Simple Store for reactive state, Simple Scope for build-time scoped IDs, and Simple Query for DOM scripting.",
			favicon: "/favicon.svg",
			head: [
				// Canonical Twitter / OG defaults applied to every page.
				{
					tag: "meta",
					attrs: { name: "twitter:card", content: "summary_large_image" },
				},
				{
					tag: "meta",
					attrs: { property: "og:site_name", content: "Simple Stack" },
				},
				{
					tag: "meta",
					attrs: { name: "robots", content: "index, follow, max-image-preview:large" },
				},
				// Organization structured data for AEO / rich results.
				{
					tag: "script",
					attrs: { type: "application/ld+json" },
					content: JSON.stringify(organizationJsonLd),
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
		sitemap({
			// Keep the sitemap aligned with indexable pages only. The deprecated
			// stream and form docs set <meta name="robots" content="noindex">,
			// so they should not be advertised to search engines.
			filter: (page) =>
				!page.startsWith(`${SITE_URL}/stream`) &&
				!page.startsWith(`${SITE_URL}/form`),
		}),
	],
});
