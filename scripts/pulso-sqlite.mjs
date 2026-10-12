import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
const require = createRequire(import.meta.url);
const { Miniflare, convertV4MiniflareOptions } = createRequire(require.resolve('wrangler/package.json'))('miniflare');
const bundle = process.env.RCP_PULSO_BUNDLE || 'tmp/pulso-bundle/worker.js';
const script = await readFile(bundle, 'utf8');
// Local workerd + real SQLite. AI is absent and disabled; network cannot be
// used as an implicit model stub. No provider tokens or conversations required.
const mf = new Miniflare(convertV4MiniflareOptions({
  modules: true, script, compatibilityDate: '2026-10-12',
  durableObjects: { PULSO_BUDGET: { className: 'PulsoBudget', useSQLite: true } },
  bindings: { AI_ENABLED: 'false', ACCOUNT_TIER: 'unverified', ALLOWED_ORIGINS: 'https://rcp.services' },
}));
try {
  const namespace = await mf.getDurableObjectNamespace('PULSO_BUDGET');
  const stub = namespace.get(namespace.idFromName('pulso-global-v1'));
  const request = i => new Request('http://budget/', { method: 'POST', body: JSON.stringify({ visitor: `synthetic-${i}`, requestId: `synthetic-${i}`, action: 'reserve' }) });
  const replies = await Promise.all(Array.from({ length: 150 }, async (_, i) => (await stub.fetch(request(i))).json()));
  assert.equal(replies.filter(result => result.allowed).length, 100);
  assert.equal(replies.filter(result => result.reason === 'daily_budget').length, 50);
  const later = await (await namespace.get(namespace.idFromName('pulso-global-v1')).fetch(request(200))).json();
  assert.equal(later.reason, 'daily_budget');
  const disabled = await mf.dispatchFetch('http://worker/answer', {
    method: 'POST', headers: { origin: 'https://rcp.services', 'content-type': 'application/json' },
    body: JSON.stringify({ ids: ['service-sitios-web'], locale: 'es', requestId: '00000000-0000-4000-8000-000000000000', version: 'pulso-public-v1' }),
  });
  assert.equal((await disabled.json()).reason, 'disabled');
  console.log(JSON.stringify({ passed: true, sqliteConcurrentRequests: 150, reservations: 100, rejected: 50, modelCalls: 0 }));
} finally { await mf.dispose(); }
