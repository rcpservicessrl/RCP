import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

const read = (path) => readFile(new URL(`../dist/${path}`, import.meta.url), 'utf8');

test('built public routes expose canonical and legal pages', async () => {
  for (const route of ['', 'servicios/', 'tienda/', 'diagnostico/', 'privacidad/', 'terminos/', 'cookies/', 'reembolsos/', 'accesibilidad/']) {
    const html = await read(`${route}index.html`);
    assert.match(html, /<link rel="canonical" href="https:\/\/rcp\.services\//);
  }
});

test('built private routes remain excluded from indexing', async () => {
  for (const route of ['checkout/', 'portal/', 'dashboard/', 'propuesta-inversion/']) {
    const html = await read(`${route}index.html`);
    assert.match(html, /<meta name="robots" content="noindex, nofollow, noarchive">/);
  }
});

test('built checkout never presents a payment action', async () => {
  const html = await read('checkout/index.html');
  assert.doesNotMatch(html, /Procesar Pago Seguro|CardNet|PayPal|Número de tarjeta/);
  assert.match(html, /Continuar por WhatsApp/);
  assert.match(html, /Continuar por correo/);
});
