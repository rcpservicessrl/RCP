import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = process.argv[2];
if (!origin || !/^https:\/\//.test(origin)) {
  throw new Error("Pass the HTTPS origin to verify.");
}

const healthResponse = await fetch(new URL("/api/health", origin));
assert.equal(healthResponse.status, 200, "production health endpoint must respond");
const health = await healthResponse.json();
assert.equal(health.ok, true);
assert.equal(health.deliveryMode, "crm");

const browser = await chromium.launch({ headless: true });
try {
  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: width === 390 ? 844 : 900 },
      isMobile: width === 390,
      hasTouch: width === 390,
    });
    try {
      const page = await context.newPage();
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      const response = await page.goto(origin, { waitUntil: "domcontentloaded", timeout: 30000 });
      assert.equal(response?.status(), 200);
      await page.waitForFunction(() => {
        const button = document.querySelector(".site-header button");
        return button && Object.keys(button).some((key) => key.startsWith("__reactFiber$"));
      }, null, { timeout: 30000 });
      await page.waitForTimeout(1200);

      const consent = page.getByRole("button", { name: "Solo esenciales" });
      if (await consent.isVisible().catch(() => false)) await consent.click();

      if (width === 390) {
        await page.getByRole("button", { name: "Abrir menú" }).click();
        await page.getByRole("dialog", { name: "Menú" }).waitFor({ state: "visible" });
      }
      const themeButton = width === 390
        ? page.getByRole("dialog", { name: "Menú" }).getByRole("button", { name: "Cambiar tema" })
        : page.getByRole("button", { name: "Cambiar tema" });
      const before = await page.locator("html").getAttribute("data-theme");
      await themeButton.click();
      assert.notEqual(await page.locator("html").getAttribute("data-theme"), before, "theme button must work");
      if (width === 390) await page.keyboard.press("Escape");
      assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, "viewport must not overflow");

      await page.goto(new URL("/diagnostico", origin).href, { waitUntil: "domcontentloaded" });
      await page.waitForTimeout(1200);
      const headerControl = width === 390
        ? page.getByRole("button", { name: "Abrir menú" })
        : page.getByRole("button", { name: "Cambiar tema" });
      await headerControl.waitFor({ state: "visible" });
      assert.deepEqual(errors, [], `browser errors at ${width}px`);
      console.log(`Production browser smoke passed at ${width}px`);
    } finally {
      await context.close();
    }
  }
} finally {
  await browser.close();
}
