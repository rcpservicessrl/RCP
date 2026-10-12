import assert from 'node:assert/strict';
import { registerHooks } from 'node:module';
import { randomUUID } from 'node:crypto';
import { after, test } from 'node:test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

const hooks = registerHooks({ resolve(specifier, context, next) {
  if (specifier.startsWith('@/')) return next(pathToFileURL(path.join(process.cwd(), `${specifier.slice(2)}.ts`)).href, context);
  if (specifier.startsWith('.') && !path.extname(specifier)) return next(`${specifier}.ts`, context);
  return next(specifier, context);
} });
after(() => hooks.deregister());
const { publicTopics, approvedTopics, modelMessages, predefinedReply, validatedGeneration, validatedReply, PULSO_VERSION } = await import('../lib/pulso-public.ts');
const { changeBudget, DAILY_CALL_LIMIT, DAILY_NEURON_BUDGET } = await import('../workers/pulso/budget.ts');
const { handlePulso } = await import('../workers/pulso/worker.ts');
const { PULSO_MODEL } = await import('../workers/pulso/model.ts');
const { boundedJson } = await import('../lib/pulso-http.ts');
const { safePulsoEndpoint } = await import('../lib/pulso-endpoint.ts');
const ids = ['service-sitios-web'];
const answer = 'RCP puede ayudarte a crear una experiencia web clara y conectada con tu siguiente paso comercial.';
const output = () => ({ response: JSON.stringify({ answer, sourceIds: ids }) });
const secret = 'synthetic-local-only-pulso-secret-value';
const visitor = 'a'.repeat(64);
const workerRequest = (patch = {}, headers = {}) => new Request('https://test.workers.dev/answer', {
  method: 'POST', headers: { origin: 'https://rcp.services', 'content-type': 'application/json', 'cf-connecting-ip': '192.0.2.1', ...headers },
  body: JSON.stringify({ ids, locale: 'es', requestId: randomUUID(), version: PULSO_VERSION, ...patch }),
});
function storage() {
  let saved;
  let queue = Promise.resolve();
  return {
    transaction(action) {
      const result = queue.then(() => action({ get: async () => structuredClone(saved), put: async (_, value) => { saved = structuredClone(value); } }));
      queue = result.catch(() => {});
      return result;
    },
    snapshot: () => structuredClone(saved),
  };
}
function env(run = async () => output()) {
  const data = storage();
  let calls = 0;
  return {
    AI_ENABLED: 'true', ACCOUNT_TIER: 'workers-free', VISITOR_HMAC_SECRET: secret, ALLOWED_ORIGINS: 'https://rcp.services,https://www.rcp.services',
    AI: { async run(...args) { calls++; return run(...args); } },
    PULSO_BUDGET: { idFromName: name => name, get: () => ({ fetch: async request => {
      const body = await request.json();
      return Response.json(await changeBudget(data, body.visitor, body.requestId, body.action));
    } }) }, data, calls: () => calls,
  };
}
test('only reviewed public topics enter retrieval; private, fiscal and pricing questions use predefined sources', () => {
  assert.ok(publicTopics('necesito un sitio web').generative);
  assert.equal(publicTopics('what website services do you have').generative, true);
  for (const query of ['precio de sitio web', 'certificación DGII', 'facturación electrónica', 'cuanto cuesta software', 'private client password sitio web', 'expediente del cliente', 'web user@example.test']) assert.equal(publicTopics(query).generative, false, query);
  assert.equal(publicTopics('zxqxyz').ids.length, 0);
  for (const value of [[], ['client-graph'], ['service-crm-marketing'], ['service-sitios-web', 'service-sitios-web'], ['file:///secrets']]) assert.equal(approvedTopics(value), null);
  assert.throws(() => modelMessages(['route-electronic-invoicing'], 'es'));
  assert.ok(predefinedReply([], 'es').sources.some(source => source.href === '/contacto'));
});

test('model input is public only, bounded and has no user text, history, retrieval tools or external URLs', () => {
  const text = JSON.stringify(modelMessages(ids, 'es'));
  assert.match(text, /experiencia web/);
  assert.doesNotMatch(text, /private@example|visitor|https:|client-graph|supabase/i);
  assert.ok(new TextEncoder().encode(text).length < 8192);
  assert.equal(DAILY_NEURON_BUDGET, 6400);
});

test('invalid generations cannot introduce prices, tax claims, links, HTML or unapproved source IDs', () => {
  assert.equal(validatedGeneration(output(), ids, 'es').mode, 'generated');
  for (const raw of [null, {}, { response: 'oops' }, { response: 'x'.repeat(2500) },
    ...['El servicio cuesta USD cien y lo garantizamos.', 'Tenemos certificación DGII y hacemos facturación.', '<script>alert(1)</script>', 'Visita https://evil.test para contratar.', 'El sitio web cuesta 500 dólares.', 'Guaranteed tax compliance for your business.'].map(text => ({ response: JSON.stringify({ answer: text, sourceIds: ids }) })),
    { response: JSON.stringify({ answer, sourceIds: ['private'] }) },
  ]) assert.equal(validatedGeneration(raw, ids, 'es'), null);
  const repaired = validatedReply({ mode: 'generated', answer, sources: [{ id: ids[0], href: 'https://evil.test' }] }, ids, 'es');
  assert.equal(repaired.sources[0].href, '/catalogo?servicio=sitios-web');
  assert.equal(validatedReply({ mode: 'predefined', answer: 'malicious price', reason: 'quota', retryAfter: Infinity }, ids, 'es').answer, predefinedReply(ids, 'es').answer);
});

test('persistent global reservations are atomic across concurrency and restart; UTC rollover resets budget', async () => {
  const data = storage();
  const now = Date.UTC(2026, 9, 12, 23, 59);
  const results = await Promise.all(Array.from({ length: 150 }, (_, i) => changeBudget(data, `visitor-${i}`, `request-${i}`, 'reserve', now)));
  assert.equal(results.filter(result => result.allowed).length, DAILY_CALL_LIMIT);
  assert.equal(data.snapshot().count, DAILY_CALL_LIMIT);
  assert.equal((await changeBudget(data, 'new', 'new', 'reserve', now + 1)).reason, 'daily_budget');
  assert.equal((await changeBudget(data, 'new', 'new', 'reserve', now + 61000)).allowed, true);
  assert.equal(data.snapshot().count, 1);
});

test('Workers AI parsed JSON responses retain the same content, source and size boundaries', async () => {
  const parsed = { answer, sourceIds: ids };
  assert.deepEqual(validatedGeneration({ response: parsed }, ids, 'es'), validatedGeneration(output(), ids, 'es'));
  for (const response of [null, [], true, 42, { answer, sourceIds: ['private'] },
    { answer: 'Visita https://evil.test para contratar.', sourceIds: ids },
    { answer: 'El sitio web cuesta 500 dólares.', sourceIds: ids },
    { ...parsed, padding: 'x'.repeat(2400) }]) {
    assert.equal(validatedGeneration({ response }, ids, 'es'), null);
  }
  const runtime = env(async () => ({ response: parsed }));
  const reply = await (await handlePulso(workerRequest(), runtime)).json();
  assert.equal(reply.mode, 'generated');
  assert.equal(reply.sources[0].href, '/catalogo?servicio=sitios-web');
  assert.equal(runtime.calls(), 1);
  assert.equal(runtime.data.snapshot().count, 1);
});

test('visitors have cooldown, six daily calls and deduplicated transport retries', async () => {
  const data = storage(); const now = Date.UTC(2026, 9, 12);
  assert.equal((await changeBudget(data, visitor, 'first', 'reserve', now)).allowed, true);
  assert.equal((await changeBudget(data, visitor, 'first', 'reserve', now + 30001)).reason, 'duplicate');
  assert.equal((await changeBudget(data, visitor, 'second', 'reserve', now + 1)).reason, 'cooldown');
  for (let i = 1; i < 6; i++) assert.equal((await changeBudget(data, visitor, `request-${i}`, 'reserve', now + i * 30000)).allowed, true);
  assert.equal((await changeBudget(data, visitor, 'seventh', 'reserve', now + 200000)).reason, 'visitor_budget');
  assert.equal(data.snapshot().count, 6);
});

test('worker invokes only the fixed candidate with bounded output and reconstructs approved links', async () => {
  const runtime = env(async (model, input, options) => {
    assert.equal(model, PULSO_MODEL); assert.equal(input.max_tokens, 256); assert.equal(options.rejectIfBusy, true);
    assert.equal(input.messages.length, 2); return output();
  });
  const response = await handlePulso(workerRequest(), runtime);
  assert.equal((await response.json()).mode, 'generated');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.equal(runtime.calls(), 1); assert.equal(runtime.data.snapshot().count, 1);
});

test('disabled, paid, unauthorized, stale, oversized or injected requests make zero AI calls', async () => {
  for (const patch of [{ AI_ENABLED: 'false' }, { ACCOUNT_TIER: 'workers-paid' }, { ACCOUNT_TIER: 'unverified' }]) {
    const runtime = Object.assign(env(), patch);
    assert.equal((await (await handlePulso(workerRequest(), runtime)).json()).mode, 'predefined');
    assert.equal(runtime.calls(), 0);
  }
  const runtime = env();
  for (const request of [workerRequest({}, { origin: 'https://evil.test' }), workerRequest({ ids: ['route-electronic-invoicing'] }), workerRequest({ context: 'private injection' }), workerRequest({ model: '@cf/moonshotai/kimi-k2.7-code' }), workerRequest({ visitor: 'fake' }), workerRequest({ locale: ['es'] }), workerRequest({ requestId: '-'.repeat(36) }), workerRequest({ extra: 'x'.repeat(2000) })]) assert.ok((await handlePulso(request, runtime)).status >= 400);
  assert.equal((await (await handlePulso(workerRequest({ version: 'old' }), runtime)).json()).reason, 'version');
  assert.equal(runtime.calls(), 0);
});

test('provider quota blocks all further model calls until UTC reset; transient capacity opens a short circuit', async () => {
  for (const [error, expected] of [[Object.assign(new Error('limit'), { code: 3036 }), 'quota'], [new Error('3040 capacity'), 'provider'], [new Error('5016 agreement'), 'account']]) {
    const runtime = env(async () => { throw error; });
    const result = await (await handlePulso(workerRequest(), runtime)).json();
    assert.equal(result.reason, expected); assert.ok(result.retryAfter > 0);
    assert.equal((await (await handlePulso(workerRequest({}, { 'cf-connecting-ip': '192.0.2.2' }), runtime)).json()).reason, expected);
    assert.equal(runtime.calls(), 1); assert.equal(runtime.data.snapshot().count, 1);
  }
});

test('invalid model output opens a circuit and preserves deterministic guidance', async () => {
  const runtime = env(async () => ({ response: 'invalid JSON' }));
  const first = await (await handlePulso(workerRequest(), runtime)).json();
  assert.equal(first.mode, 'predefined'); assert.equal(first.reason, 'invalid_response');
  await handlePulso(workerRequest({}, { 'cf-connecting-ip': '192.0.2.2' }), runtime);
  assert.equal(runtime.calls(), 1);
});

test('AI timeout does not refund or retry inference and late results do not reach the caller', async () => {
  const runtime = env(async () => new Promise(() => {}));
  const result = await (await handlePulso(workerRequest(), runtime)).json();
  assert.equal(result.mode, 'predefined'); assert.equal(result.reason, 'timeout');
  await handlePulso(workerRequest({}, { 'cf-connecting-ip': '192.0.2.2' }), runtime);
  assert.equal(runtime.calls(), 1); assert.equal(runtime.data.snapshot().count, 1);
});

test('quota store failure is fail-closed with zero inference', async () => {
  const runtime = env();
  runtime.PULSO_BUDGET.get = () => ({ fetch: async () => { throw Error('storage down'); } });
  assert.equal((await (await handlePulso(workerRequest(), runtime)).json()).reason, 'budget_unavailable');
  assert.equal(runtime.calls(), 0);
});

test('bounded JSON stops oversized UTF-8 and stalled bodies before buffering their tail', async () => {
  let canceled = false;
  const stream = new ReadableStream({ pull(controller) { controller.enqueue(new Uint8Array(2048)); }, cancel() { canceled = true; } });
  await assert.rejects(boundedJson(new Response(stream), 1024), /body_limit/);
  assert.equal(canceled, true);
  await assert.rejects(boundedJson(new Response(new ReadableStream({})), 1024, 10), /body_timeout/);
});

test('CORS restricts exact origins and preflight never invokes the model', async () => {
  const runtime = env();
  const preflight = await handlePulso(new Request('https://test.workers.dev/answer', { method: 'OPTIONS', headers: { origin: 'https://rcp.services' } }), runtime);
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://rcp.services');
  assert.equal(preflight.headers.get('access-control-allow-credentials'), null);
  for (const origin of ['', 'https://evil.test', 'https://rcp.services.evil.test']) assert.equal((await handlePulso(workerRequest({}, { origin }), runtime)).status, 403);
  assert.equal((await handlePulso(workerRequest({}, { 'content-type': 'text/plain' }), runtime)).status, 415);
  assert.equal((await (await handlePulso(workerRequest({}, { 'cf-connecting-ip': '' }), runtime)).json()).reason, 'identity_unavailable');
  assert.equal(runtime.calls(), 0);
});

test('edge visitor identity is HMAC-protected and client payload cannot replace it', async () => {
  const runtime = env();
  assert.equal((await (await handlePulso(workerRequest({}, { 'x-forwarded-for': 'fake' }), runtime)).json()).mode, 'generated');
  const state = runtime.data.snapshot();
  assert.equal(Object.keys(state.visitors).length, 1);
  assert.match(Object.keys(state.visitors)[0], /^[a-f0-9]{64}$/);
  assert.doesNotMatch(JSON.stringify(state), /192\.0|fake|question|answer/);
  const second = await (await handlePulso(workerRequest({}, { 'x-forwarded-for': 'rotated' }), runtime)).json();
  assert.equal(second.reason, 'cooldown');
  assert.equal((await handlePulso(workerRequest({ visitor: 'forged' }), runtime)).status, 400);
  assert.equal(runtime.calls(), 1);
});

test('endpoint configuration rejects credentials, query injection and arbitrary hosts', () => {
  assert.equal(safePulsoEndpoint('https://test.workers.dev/answer'), 'https://test.workers.dev/answer');
  for (const value of [undefined, '', 'http://localhost/answer', 'https://evil.test/answer', 'https://test.workers.dev/answer?next=private', 'https://user:password@test.workers.dev/answer', 'https://test.workers.dev:444/answer']) assert.equal(safePulsoEndpoint(value), null);
});
