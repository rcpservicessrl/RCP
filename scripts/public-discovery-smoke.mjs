import assert from "node:assert/strict";
import { chromium } from "playwright";

const origin = new URL(process.argv[2] ?? "http://localhost:3100");
const sitemap = await fetch(new URL("/sitemap.xml", origin)).then((response) => response.text());
const routes = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => new URL(match[1]).pathname);
assert.equal(routes.length, 50, "all canonical public pages must remain in the sitemap");
assert.match(sitemap, /hreflang="es-DO"/);
assert.match(sitemap, /hreflang="en-US"/);
assert.doesNotMatch(sitemap, /<lastmod>/, "do not publish a fabricated site-wide modification date");

for (const route of routes) {
  const response = await fetch(new URL(route, origin));
  assert.equal(response.status, 200, route);
  const html = await response.text();
  assert.equal((html.match(/class="site-footer(?: |")/g) ?? []).length, 1, `${route}: one shared footer`);
  assert.equal((html.match(/class="whatsapp-float"/g) ?? []).length, 1, `${route}: one WhatsApp control`);
  assert.match(html, /href="tel:\+18298068092"/);
  assert.match(html, /https:\/\/www\.instagram\.com\/rcp\.services_/);
  assert.match(html, /https:\/\/www\.facebook\.com\/rcp\.servicessrl/);
  assert.match(html, /https:\/\/www\.linkedin\.com\/company\/rcp-services\//);
  assert.match(html, /https:\/\/www\.threads\.com\/@rcp\.services_/);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  const business = schemas.filter((schema) => schema["@id"] === "https://rcp.services/#organization");
  assert.equal(business.length, 1, `${route}: one business entity`);
  assert.equal(business[0].telephone, "+1-829-806-8092");
  assert.equal(business[0].address.streetAddress, "Av. Rómulo Betancourt 1302, Bella Vista");
  assert.ok(business[0].sameAs.includes("https://www.threads.com/@rcp.services_"));
  assert.match(html, /name="msvalidate\.01"/);
  assert.match(html, /name="google-site-verification"/);
}

const browser = await chromium.launch({ headless: true });
let views = 0;
try {
  for (const width of [1024, 1280, 1281, 1380, 1381, 1440, 1920]) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    for (const route of ["/", "/en"]) {
      await page.goto(new URL(route, origin).href, { waitUntil: "load" });
      const clipped = await page.locator(".site-header a, .site-header button").evaluateAll((elements) => elements.filter((element) => {
        const rect = element.getBoundingClientRect();
        return rect.width > 0 && (rect.left < 0 || rect.right > innerWidth);
      }).map((element) => element.textContent || element.getAttribute("aria-label")));
      assert.deepEqual(clipped, [], `${route} ${width}: all header controls inside viewport`);
    }
    await page.close();
  }
  for (const width of [1440, 390, 320]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 500, hasTouch: width < 500 });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    for (const route of ["/", "/contacto", "/en", "/en/contact"]) {
      await page.goto(new URL(route, origin).href, { waitUntil: "networkidle" });
      const whatsapp = page.locator(".whatsapp-float");
      const consent = page.locator(".consent-banner button").first();
      if (await consent.isVisible()) {
        if (width < 500) await page.locator(".consent-whatsapp").click({ trial: true });
        await consent.click();
      }
      await whatsapp.click({ trial: true });
      assert.equal(await whatsapp.getAttribute("target"), "_blank");
      assert.equal(await whatsapp.getAttribute("href"), "https://wa.me/18298068092?text=Hola%20RCP%20Services%2C%20quiero%20mi%20evaluaci%C3%B3n%20inicial");
      for (const theme of ["light", "dark"]) {
        await page.evaluate((value) => { document.documentElement.dataset.theme = value; }, theme);
        await page.locator(".site-footer").scrollIntoViewIfNeeded();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), true, `${route} ${width} ${theme}: no overflow`);
        for (const link of await page.locator(".social-links a").all()) await link.click({ trial: true });
        await page.locator('a[href="tel:+18298068092"]').click({ trial: true });
        await whatsapp.click({ trial: true });
        const contrast = await page.locator(".social-links a").first().evaluate((element) => {
          const rgb = (value) => value.match(/[\d.]+/g).slice(0, 3).map(Number);
          const luminance = (value) => rgb(value).map((channel) => channel / 255).map((channel) => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [.2126, .7152, .0722][index], 0);
          const text = luminance(getComputedStyle(element).color);
          const background = luminance(getComputedStyle(element.closest("footer")).backgroundColor);
          return (Math.max(text, background) + .05) / (Math.min(text, background) + .05);
        });
        assert.ok(contrast >= 4.5, `${route} ${width} ${theme}: social text contrast ${contrast}`);
        views++;
      }
    }
    await page.goto(new URL("/catalogo", origin).href, { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /^Agregar / }).first().click();
    await page.locator(".selection-tray").waitFor();
    await page.locator(".whatsapp-float").click({ trial: true });
    await page.locator(".pulso-help__trigger").click();
    await page.getByRole("dialog", { name: "Guía de Pulso" }).waitFor();
    await page.keyboard.press("Escape");
    assert.equal(await page.locator(".pulso-help__trigger").getAttribute("aria-expanded"), "false");
    assert.deepEqual(errors, [], `page errors at ${width}px`);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(JSON.stringify({ origin: origin.origin, publicRoutes: routes.length, responsiveThemeViews: views, widths: [1440, 390, 320], pageErrors: 0 }));
