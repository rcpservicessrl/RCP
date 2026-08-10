import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
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

test('corporate browser clients are pinned to the rcp_services schema', async () => {
  const schemaClients = await Promise.all([
    read('src/pages/portal.astro'),
    read('src/pages/onboarding.astro'),
    read('src/pages/carreras.astro'),
    read('src/pages/formulario-contacto.astro'),
    read('public/scripts/dashboard.js')
  ]);

  for (const source of schemaClients) {
    assert.match(source, /db:\s*\{\s*schema:\s*'rcp_services'\s*\}/);
    assert.doesNotMatch(source, /schema:\s*'public'/);
  }

  assert.match(await read('public/tienda.js'), /'Accept-Profile':'rcp_services'/);
  assert.match(await read('src/pages/checkout.astro'), /'Accept-Profile': 'rcp_services'/);
});

test('public flows cannot create client identities or use reusable access codes', async () => {
  const [portal, dashboard, booking, dashboardPage] = await Promise.all([
    read('src/pages/portal.astro'),
    read('public/scripts/dashboard.js'),
    read('public/script.js'),
    read('src/pages/dashboard.astro')
  ]);
  const content = [portal, dashboard, booking, dashboardPage].join('\n');

  assert.doesNotMatch(content, /verificar_existencia_cliente|access_code|access_code_hash|clientPassword|clientAccessCode|supabaseData/);
  assert.doesNotMatch(booking, /\.from\('clientes'\)|\.rpc\(/);
  assert.doesNotMatch(dashboard, /password:\s*password/);
  assert.match(portal, /rpc\('ensure_client_profile'\)/);
  assert.match(await read('src/pages/onboarding.astro'), /status:\s*'review'/);
});

test('public forms use isolated intake tables and private object paths', async () => {
  const [careers, contact] = await Promise.all([
    read('src/pages/carreras.astro'),
    read('src/pages/formulario-contacto.astro')
  ]);

  assert.match(careers, /\.from\('postulaciones'\)/);
  assert.doesNotMatch(careers, /\.from\('candidatos'\)|getPublicUrl\(filePath\)/);
  assert.match(contact, /\.from\('contactos'\)/);
  assert.doesNotMatch(contact, /getPublicUrl\(filePath\)/);
  assert.match(careers, /crypto\.randomUUID\(\)/);
  assert.match(contact, /crypto\.randomUUID\(\)/);
});

test('legacy SQL snippets fail closed before historical public-schema DDL', async () => {
  const snippetsDirectory = new URL('../supabase/snippets/', import.meta.url);
  const entries = await readdir(snippetsDirectory, { withFileTypes: true });
  const sqlFiles = entries.filter((entry) => entry.isFile() && entry.name.endsWith('.sql'));

  assert.ok(sqlFiles.length > 0);
  for (const entry of sqlFiles) {
    const content = await readFile(new URL(entry.name, snippetsDirectory), 'utf8');
    const guard = content.slice(0, 500);
    assert.match(guard, /ARCHIVED SNAPSHOT — DO NOT EXECUTE/i, entry.name);
    assert.match(guard, /RAISE EXCEPTION 'Archived RCP Services SQL/i, entry.name);
    assert.match(guard, /20260810160000/, entry.name);
  }
});
