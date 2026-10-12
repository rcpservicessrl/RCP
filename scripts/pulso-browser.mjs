import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { predefinedReply, validatedGeneration } from '../lib/pulso-public.ts';
import { registerHooks } from 'node:module';

const hooks = registerHooks({ resolve(specifier, context, next) {
  return next(specifier.startsWith('.') && !/\.[a-z]+$/.test(specifier) ? `${specifier}.ts` : specifier, context);
} });
const baseURL = process.env.RCP_E2E_BASE_URL || 'http://127.0.0.1:3122';
const evidence = process.env.RCP_PULSO_EVIDENCE_DIR || 'tmp/pulso-browser';
await mkdir(evidence, { recursive: true });
const browser = await chromium.launch(process.env.RCP_E2E_CHROME === '1' ? { channel: 'chrome', headless: true } : { headless: true });
const results = [];
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    for (const scenario of ['generated', 'quota', 'invalid', 'network', 'timeout', 'retry', 'close', 'policy', 'offline', 'disabled']) {
      console.error(`Pulso browser: ${viewport.width}px ${scenario}`);
      const context = await browser.newContext({ viewport });
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = []; const requests = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', route => route.fulfill({ contentType: 'application/javascript', body: 'window.turnstile={render:(el,options)=>{setTimeout(()=>options.callback("pulso-local-token"),0);return "synthetic";},remove:()=>{}};' }));
      await page.route('https://pulso-fixture.example.workers.dev/answer', async route => {
        if (route.request().method() === 'OPTIONS') return route.fulfill({ status: 204, headers: { 'access-control-allow-origin': new URL(baseURL).origin, 'access-control-allow-methods': 'POST', 'access-control-allow-headers': 'content-type' } });
        const payload = route.request().postDataJSON(); requests.push(payload);
        assert.deepEqual(Object.keys(payload).sort(), ['ids', 'locale', 'requestId', 'version']);
        assert.doesNotMatch(JSON.stringify(payload), /necesito|confidencial|history|query/);
        if (scenario === 'network' || scenario === 'retry' && requests.length === 1) return route.abort();
        if (scenario === 'timeout' || scenario === 'close') return; // held until page close; no external request
        const generated = validatedGeneration({ response: JSON.stringify({ answer: 'RCP puede ayudarte con una experiencia web clara y conectada con el siguiente paso comercial.', sourceIds: payload.ids }) }, payload.ids, payload.locale);
        const body = scenario === 'invalid' ? { mode: 'generated', answer: '<script>unsafe</script>', sources: [{ id: 'private' }] }
          : scenario === 'quota' || scenario === 'disabled' ? predefinedReply(payload.ids, payload.locale, scenario, 300) : generated;
        return route.fulfill({ contentType: 'application/json', headers: { 'access-control-allow-origin': new URL(baseURL).origin }, body: JSON.stringify(body) });
      });
      await page.goto(baseURL, { waitUntil: 'domcontentloaded' });
      // SSR buttons are visible before hydration. The existing Turnstile
      // component's synthetic callback proves that the home root has mounted.
      await page.waitForFunction(() => document.querySelector('input[name="turnstileToken"]')?.value === 'pulso-local-token');
      // The approved mobile consent layout hides floating controls while the
      // banner is open. Dismiss with essentials only; never enable analytics.
      await page.getByRole('button', { name: 'Solo esenciales', exact: true }).click();
      await page.locator('.consent-banner').waitFor({ state: 'detached' });
      const trigger = page.locator('.pulso-help__trigger');
      assert.equal(await trigger.getAttribute('aria-label'), 'Abrir guía de Pulso');
      try { await trigger.click(); }
      catch (error) {
        await page.screenshot({ path: `${evidence}/failed-trigger-${viewport.width}-${scenario}.png` });
        console.error(JSON.stringify({ scenario, errors, url: page.url(), title: await page.title(), pulso: await page.locator('.pulso-help').innerText(), buttons: await page.getByRole('button').allTextContents() }));
        throw error;
      }
      const panel = page.getByRole('dialog', { name: 'Guía de Pulso' });
      const input = panel.locator('.pulso-question input');
      try { await input.waitFor({ state: 'visible' }); }
      catch (error) {
        await page.screenshot({ path: `${evidence}/failed-${viewport.width}-${scenario}.png` });
        console.error(JSON.stringify({ scenario, errors, expanded: await trigger.getAttribute('aria-expanded'), panel: await page.locator('.pulso-help').innerText() }));
        throw error;
      }
      assert.equal(await input.evaluate(element => element.labels?.[0]?.textContent), '¿Qué necesitas encontrar?');
      const questionBounds = await panel.locator('.pulso-question').boundingBox();
      const actionsBounds = await panel.locator('.pulso-help__actions').boundingBox();
      assert.ok(questionBounds && actionsBounds && questionBounds.y < actionsBounds.y, 'consultation appears before secondary actions');
      assert.ok(actionsBounds.height <= 160, 'secondary actions stay compact');
      await input.fill(scenario === 'policy' ? 'precio de sitio web y certificación DGII' : 'necesito un sitio web');
      if (scenario === 'offline') await context.setOffline(true);
      await panel.getByRole('button', { name: 'Consultar a Pulso', exact: true }).click();
      if (scenario === 'close') {
        await page.waitForFunction(() => document.querySelector('.pulso-question button')?.textContent.includes('Consultando'));
        await page.keyboard.press('Escape');
        await panel.waitFor({ state: 'detached' });
        assert.equal(await trigger.evaluate(element => document.activeElement === element), true);
        await trigger.click();
        assert.equal(await page.locator('.pulso-question__reply').innerText(), '');
        assert.equal(await input.inputValue(), '');
      } else {
        const expected = ['generated', 'retry'].includes(scenario) ? 'Respuesta con IA' : 'Información predefinida';
        if (scenario === 'retry') {
          await panel.getByRole('button', { name: 'Reintentar una vez' }).click();
          assert.equal(requests[0].requestId, requests[1].requestId);
          assert.equal(await panel.getByRole('button', { name: 'Reintentar una vez' }).count(), 0);
        }
        await panel.getByRole('status').filter({ hasText: expected }).waitFor();
        await page.waitForFunction(() => document.querySelector('.pulso-question button')?.textContent === 'Consultar a Pulso');
        assert.ok(await panel.getByRole('link', { name: 'Hablar con el equipo de RCP' }).count());
        assert.equal(await panel.locator('a[href^="https://evil"]').count(), 0);
        if (scenario === 'policy' || scenario === 'offline') assert.equal(requests.length, 0);
        else assert.equal(requests.length, scenario === 'retry' ? 2 : 1);
        // The added input participates in the existing keyboard focus loop.
        const close = panel.getByRole('button', { name: 'Cerrar guía' });
        await close.focus(); await page.keyboard.press('Shift+Tab');
        assert.equal(await close.evaluate(element => document.activeElement === element), false);
        await page.keyboard.press('Tab');
        assert.equal(await close.evaluate(element => document.activeElement === element), true);
        await panel.evaluate(element => Promise.all(element.getAnimations().map(animation => animation.finished.catch(() => undefined))));
        const closeBounds = await close.boundingBox();
        assert.ok(closeBounds.width >= 44 && closeBounds.height >= 44 && closeBounds.y >= 84 && closeBounds.y + closeBounds.height <= viewport.height, 'close control stays visible below the fixed header');
        await page.screenshot({ path: `${evidence}/${viewport.width}-${scenario}.png`, fullPage: false });
        await page.keyboard.press('Escape');
        await panel.waitFor({ state: 'detached' });
      }
      const layout = await page.evaluate(() => ({ width: window.innerWidth, scroll: document.documentElement.scrollWidth }));
      assert.ok(layout.scroll <= layout.width, `overflow ${scenario}`);
      assert.deepEqual(errors, []);
      results.push({ width: viewport.width, scenario, passed: true, requests: requests.length });
      await context.close();
    }
    // English path and both theme tokens remain usable.
    const context = await browser.newContext({ viewport }); const page = await context.newPage();
    await page.route('https://pulso-fixture.example.workers.dev/answer', route => route.abort());
    await page.goto(`${baseURL}/en`);
    await page.locator('.consent-banner button').first().click();
    await page.locator('.consent-banner').waitFor({ state: 'detached' });
    await page.getByRole('button', { name: 'Open Pulso guide', exact: true }).click();
    await page.getByLabel('What would you like to find?').fill('website');
    await page.getByRole('button', { name: 'Ask Pulso', exact: true }).click();
    await page.getByRole('status').filter({ hasText: 'Predefined information' }).waitFor();
    for (const theme of ['light', 'dark']) {
      await page.evaluate(value => document.documentElement.dataset.theme = value, theme);
      await page.screenshot({ path: `${evidence}/${viewport.width}-en-${theme}.png` });
    }
    results.push({ width: viewport.width, scenario: 'english-themes', passed: true });
    await context.close();
  }
  await writeFile(`${evidence}/result.json`, JSON.stringify({ passed: results.length, results }, null, 2));
  console.log(JSON.stringify({ passed: results.length, results }));
} finally { await browser.close(); hooks.deregister(); }
