import assert from 'node:assert/strict';
import { after, test } from 'node:test';
import { registerHooks } from 'node:module';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import nextTesting from 'next/experimental/testing/server.js';
// The installed 16.3.8 package still exposes the pre-rename utility name.
const { unstable_doesMiddlewareMatch } = nextTesting;

const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === 'next/server') return nextResolve('next/server.js', context);
    if (specifier.startsWith('@/')) return nextResolve(pathToFileURL(path.join(process.cwd(), `${specifier.slice(2)}.ts`)).href, context);
    return nextResolve(specifier, context);
  },
});
after(() => hooks.deregister());
const { config, proxy } = await import('../proxy.ts');
const { default: nextConfig } = await import('../next.config.ts');
const matches = url => unstable_doesMiddlewareMatch({ config, nextConfig, url });

test('known static resources skip proxy while lookalikes, HTML, API and private routes retain it', () => {
  for (const url of ['/assets/rcp/test.svg', '/assets/test.png?v=2', '/theme-init.js', '/manifest.webmanifest', '/icono-rcp.png', '/logo_rcp_fondo_claro.svg']) assert.equal(matches(url), false, url);
  for (const url of ['/', '/en', '/catalogo', '/en/catalog', '/api/business-catalog', '/api/inquiries', '/api/specialist-applications', '/portal', '/en/portal', '/checkout', '/assets-evil/page', '/theme-init.js/child', '/api/logo_rcp_data.png', '/logo_rcp_data.svg/child']) assert.equal(matches(url), true, url);
});

test('document responses retain fresh nonces and reject a caller-supplied nonce', () => {
  const request = { headers: new Headers({ 'x-nonce': 'injected' }) };
  const first = proxy(request), second = proxy(request);
  const firstPolicy = first.headers.get('content-security-policy');
  const secondPolicy = second.headers.get('content-security-policy');
  assert.match(firstPolicy, /script-src 'self' 'nonce-[A-Za-z0-9+/]+=*'/);
  assert.notEqual(firstPolicy, secondPolicy);
  assert.equal(firstPolicy.includes('injected'), false);
  assert.equal(first.headers.get('x-middleware-request-content-security-policy'), firstPolicy);
});

test('bypassed static resources keep a restrictive CSP and API/private no-store is unchanged', async () => {
  const rules = await nextConfig.headers();
  const assets = rules.find(rule => rule.source === '/assets/:path*');
  const csp = assets.headers.find(header => header.key === 'Content-Security-Policy').value;
  assert.match(csp, /default-src 'none'; script-src 'none'/);
  assert.equal(csp.includes('nonce-'), false);
  for (const source of ['/theme-init.js', '/manifest.webmanifest', '/icono-rcp.png']) assert.equal(rules.find(rule => rule.source === source).headers[0].value, csp);
  for (const source of ['/api/:path*', '/portal/:path*', '/en/portal/:path*', '/checkout/:path*']) assert.equal(rules.find(rule => rule.source === source).headers.find(header => header.key === 'Cache-Control').value, 'private, no-store');
  assert.equal(rules[0].headers.some(header => header.key === 'X-Content-Type-Options' && header.value === 'nosniff'), true);
});
