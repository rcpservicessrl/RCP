import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

test('checkout is quote-only and accepts SKU references, not client prices', async () => {
  const source = await read('src/pages/checkout.astro');
  assert.match(source, /get\('items'\)/);
  assert.match(source, /is_active=eq\.true/);
  assert.match(source, /QUOTE_EMAIL = 'info@rcp\.services'/);
  assert.match(source, /Continuar por correo/);
  assert.doesNotMatch(source, /custom_items|Math\.random|CARDNET-|PAYPAL-|Procesar Pago Seguro/);
});

test('store has one remote catalog authority and no payment-provider claims', async () => {
  const [script, page] = await Promise.all([read('public/tienda.js'), read('src/pages/tienda.astro')]);
  assert.doesNotMatch(script, /STATIC_PRODUCT_CATALOG|rcp_cached_products|custom_items/);
  assert.doesNotMatch(page, /Stripe|CardNet|PayPal|Pagar con Tarjeta|Finalizar Compra/);
  assert.match(script, /\/checkout\?items=/);
});

test('diagnostic is local, deterministic and does not transmit PII', async () => {
  const source = await read('src/pages/diagnostico.astro');
  assert.doesNotMatch(source, /Math\.random|rcpLead|user_email|Pérdida estimada/);
  assert.match(source, /No es una auditoría/);
});

test('private and transactional routes are noindex', async () => {
  for (const path of ['src/pages/checkout.astro', 'src/pages/portal.astro', 'src/pages/propuesta-inversion.astro', 'src/layouts/DashboardLayout.astro']) {
    assert.match(await read(path), /noindex, nofollow, noarchive/, path);
  }
});

test('staging builds are explicitly excluded from indexing', async () => {
  const layout = await read('src/layouts/BaseLayout.astro');
  assert.match(layout, /PUBLIC_DEPLOYMENT_ENV === 'staging'/);
  assert.match(layout, /noindex, nofollow, noarchive/);
  assert.match(layout, /Entorno de staging/);
});

test('high-risk unsupported homepage claims are absent', async () => {
  const sources = await Promise.all([
    read('src/pages/index.astro'), read('src/data/i18n/es.json'), read('public/scripts/es.json'), read('public/script.js')
  ]);
  const content = sources.join('\n');
  assert.doesNotMatch(content, /98\.5%|\+300%|Ferretería El Clavo|Salón de Belleza Elegance|RD\$80K\/mes/);
});

test('legal policies identify the business and keep analytics non-advertising', async () => {
  for (const path of ['src/pages/privacidad.astro', 'src/pages/terminos.astro', 'src/pages/cookies.astro', 'src/pages/reembolsos.astro', 'src/pages/accesibilidad.astro']) {
    assert.ok((await read(path)).length > 500, path);
  }
  const [privacy, cookies, widgets, script, i18n, layout] = await Promise.all([
    read('src/pages/privacidad.astro'), read('src/pages/cookies.astro'), read('src/components/FloatingWidgets.astro'), read('public/script.js'), read('public/scripts/i18n.js'), read('src/layouts/BaseLayout.astro')
  ]);
  assert.match(privacy, /RNC 132-147103/);
  assert.match(privacy, /Av\. Rómulo Betancourt 1302/);
  assert.match(privacy, /Zoho Mail/);
  assert.match(cookies, /personalización y datos de usuario para anuncios permanecen desactivadas/);
  assert.doesNotMatch(widgets, /cookieMarketing/);
  assert.match(script, /'ad_storage': 'denied'/);
  assert.match(i18n, /cache: 'no-store'/);
  assert.match(layout, /taxID.*132-147103/);
});
