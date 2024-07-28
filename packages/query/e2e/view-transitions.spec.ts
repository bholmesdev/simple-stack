import { Page, expect, test } from "@playwright/test";
import { type PreviewServer, preview } from "astro";
import { generatePort, getPath } from "./utils";

const fixtureRoot = new URL("../fixtures/view-transitions", import.meta.url)
	.pathname;
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

function viewTransitionTimeout(page: Page) {
	// Safari has an artificial delay for its view transition fallback
	return page.waitForTimeout(300);
}

test("is interactive on initial load", async ({ page }) => {
	await page.goto(getPath("page-1", previewServer));

	const btn = page.getByRole("button");

	await expect(btn).toHaveAttribute("data-ready");
	await btn.click();
	await expect(btn).toContainText("1");
});

test("is interactive on navigation", async ({ page }) => {
	await page.goto(getPath("page-1", previewServer));

	const btn1 = page.getByRole("button");
	await expect(btn1).toHaveAttribute("data-ready");

	const a = page.getByRole("link");
	await a.click();
	await page.waitForURL("**/page-2");

	const btn2 = page.getByRole("button");
	await viewTransitionTimeout(page);
	await btn2.click();
	await expect(btn2).toContainText("2");
});

test("is interactive navigating back to previous page", async ({ page }) => {
	await page.goto(getPath("page-1", previewServer));

	const btnBefore = page.getByRole("button");
	await expect(btnBefore).toHaveAttribute("data-ready");
	await btnBefore.click();
	await expect(btnBefore).toContainText("1");

	const a = page.getByRole("link");
	await a.click();
	await page.waitForURL("**/page-2");
	await viewTransitionTimeout(page);

	const aBack = page.getByRole("link");
	await aBack.click();
	await page.waitForURL("**/page-1");

	const btnAfter = page.getByRole("button");
	await viewTransitionTimeout(page);
	await btnAfter.click();
	await expect(btnAfter).toContainText("1");
});
