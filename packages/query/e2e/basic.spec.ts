import { expect, test } from "@playwright/test";
import { type PreviewServer, preview } from "astro";
import { generatePort } from "./utils";

const fixtureRoot = new URL("../fixtures/basic", import.meta.url).pathname;
let previewServer: PreviewServer;

test.beforeAll(async () => {
	previewServer = await preview({
		root: fixtureRoot,
		server: { port: await generatePort() },
	});
});

test.afterAll(async () => {
	await previewServer.stop();
});

function getPath(path = "") {
	return new URL(path, `http://localhost:${previewServer.port}/`).href;
}

test("loads client JS for heading", async ({ page }) => {
	await page.goto(getPath());

	const h1 = page.getByTestId("heading");
	await expect(h1).toContainText("Heading JS loaded");
});

test("reacts to button click", async ({ page }) => {
	await page.goto(getPath("button"));

	const btn = page.getByRole("button");

	await expect(btn).toHaveAttribute("data-ready");
	await btn.click();
	await expect(btn).toContainText("1");
});

test("reacts to button effect", async ({ page }) => {
	await page.goto(getPath("effect"));

	const btn = page.getByRole("button");

	await expect(btn).toHaveAttribute("data-ready");
	await btn.click();
	await expect(btn).toContainText("1");
	const p = page.getByRole("paragraph");
	await expect(p).toContainText("1");
});

test("respects server data", async ({ page }) => {
	await page.goto(getPath("server-data"));

	const h1 = page.getByTestId("heading");
	await expect(h1).toContainText("Server data");
});

test("reacts to multiple instances of button counter", async ({ page }) => {
	await page.goto(getPath("multi-counter"));

	for (const testId of ["counter-1", "counter-2"]) {
		const counter = page.getByTestId(testId);
		const btn = counter.getByRole("button");

		await expect(btn).toHaveAttribute("data-ready");
		await expect(btn).toContainText("0");
		await btn.click();
		await expect(btn).toContainText("1");
	}
});
