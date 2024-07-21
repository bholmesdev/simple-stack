import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { dev } from "astro";
import { DOMParser } from "linkedom";

const parser = new DOMParser();

describe("basic", () => {
	describe("dev", () => {
		/** @type {Awaited<ReturnType<typeof import('astro').dev>>} */
		let server;

		before(async () => {
			server = await dev({
				root: new URL("../fixtures/basic", import.meta.url),
			});
		});

		after(() => {
			server.stop();
		});

		it("should generate scoped id", async () => {
			const res = await fetch(`http://localhost:${server.address.port}`);
			const html = await res.text();

			assert.ok(res.ok);
			const h1 = parser.parseFromString(html, "text/html").querySelector("h1");
			assert.match(h1?.getAttribute("data-target"), /^test-\w+/);
		});

		it("should generate a different scoped id for nested components", async () => {
			const res = await fetch(`http://localhost:${server.address.port}`);
			const html = await res.text();

			assert.ok(res.ok);
			const h1 = parser.parseFromString(html, "text/html").querySelector("h1");
			const scopeHash = h1?.getAttribute("data-target").split("-")[1];

			const nestedH2 = parser
				.parseFromString(html, "text/html")
				.querySelector("h2");
			const nestedScopeHash = nestedH2
				?.getAttribute("data-target")
				.split("-")[1];

			assert.notEqual(scopeHash, nestedScopeHash);
		});

		it("allows passing $ as a prop", async () => {
			const res = await fetch(`http://localhost:${server.address.port}`);
			const html = await res.text();

			assert.ok(res.ok);
			const h1 = parser.parseFromString(html, "text/html").querySelector("h1");
			const scopeHash = h1?.getAttribute("data-target").split("-")[1];

			const h3 = parser.parseFromString(html, "text/html").querySelector("h3");
			const contextScopeHash = h3?.getAttribute("data-target").split("-")[1];

			assert.equal(scopeHash, contextScopeHash);
		});
	});
});
