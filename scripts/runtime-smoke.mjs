import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.RCP_E2E_BASE_URL || 'http://127.0.0.1:3117';
const browser = await chromium.launch(process.env.RCP_E2E_CHROME === '1' ? {channel:'chrome',headless:true} : {headless:true});
const results = [];
try {
  for (const viewport of [{width:1440,height:900},{width:390,height:844}]) {
    for (const scenario of ['success','render-error','load-error','callback-error','cleanup-error']) {
      console.error(`Runtime check: ${viewport.width}px ${scenario}`);
      const context = await browser.newContext({viewport});
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      const errors = [];
      let submissions = 0;
      page.on('pageerror', error => errors.push(error.message));
      page.on('request', request => { if (request.method() === 'POST' && new URL(request.url()).origin === new URL(baseURL).origin) submissions++; });
      await page.route('**/api/**', route => route.request().method() === 'POST' ? route.abort() : route.continue());
      await page.route('https://challenges.cloudflare.com/turnstile/v0/api.js*', async route => {
        if (scenario === 'load-error') return route.abort();
        await route.fulfill({contentType:'application/javascript',body:`window.turnstile={render:function(el,options){${scenario === 'render-error' ? 'throw new Error("Provider render failure");' : scenario === 'callback-error' ? 'setTimeout(()=>options["error-callback"]("110100"),0);' : 'setTimeout(()=>options.callback("test-only-token"),0);'}return "fixture-widget";},remove:function(){${scenario === 'cleanup-error' ? 'throw new Error("Provider cleanup failure");' : ''}}};`});
      });
      const response = await page.goto(baseURL,{waitUntil:'domcontentloaded'});
      assert.equal(response.status(),200);
      await page.locator('h1').first().waitFor();
      assert.doesNotMatch(await page.locator('h1').first().innerText(),/couldn.t load/i);
      if (['render-error','load-error','callback-error'].includes(scenario)) {
        await page.getByRole('alert').filter({hasText:'La verificación no está disponible.'}).waitFor();
        assert.equal(await page.locator('input[name="turnstileToken"]').first().inputValue(),'');
        assert.ok(await page.getByRole('link',{name:'Continuar por WhatsApp',exact:true}).count());
      } else {
        await page.waitForFunction(()=>document.querySelector('input[name="turnstileToken"]')?.value === 'test-only-token');
        if (scenario === 'cleanup-error') {
          await page.locator('a[href="/servicios"]:visible').first().click();
          await page.waitForURL('**/servicios');
          assert.doesNotMatch(await page.locator('h1').first().innerText(),/couldn.t load/i);
        }
      }
      assert.deepEqual(errors,[]);
      assert.equal(submissions,0);
      results.push({width:viewport.width,scenario,passed:true});
      await context.close();
    }
  }
  console.log(JSON.stringify({passed:results.length,results}));
} finally { await browser.close(); }
