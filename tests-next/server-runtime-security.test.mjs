import assert from "node:assert/strict";
import { createServer } from "node:http";
import { registerHooks } from "node:module";
import path from "node:path";
import { after, test } from "node:test";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const hooks = registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      return nextResolve(pathToFileURL(path.join(root, `${specifier.slice(2)}.ts`)).href, context);
    }
    return nextResolve(specifier, context);
  },
});
after(() => hooks.deregister());

const { readLimitedRequestBody, PayloadTooLargeError } = await import("../lib/server/request-body.ts");
const { deliverCrm, deliverEmail } = await import("../lib/server/delivery.ts");
const { POST: inquiryPost } = await import("../app/api/inquiries/route.ts");
const { POST: specialistPost } = await import("../app/api/specialist-applications/route.ts");

let requestSequence = 0;
const request = (body, headers = {}) => new Request("https://rcp.services/api/test", {
  method: "POST",
  headers: {
    origin: "https://rcp.services",
    "content-type": "application/json",
    "idempotency-key": `security-runtime-${++requestSequence}`,
    "x-forwarded-for": `test-address-${requestSequence}`,
    ...headers,
  },
  body,
  duplex: "half",
});

test("request byte limit handles split UTF-8 and cancels an oversized stream before reading its tail", async () => {
  const bytes = new TextEncoder().encode('"á"');
  const split = new ReadableStream({
    start(controller) {
      for (const byte of bytes) controller.enqueue(new Uint8Array([byte]));
      controller.close();
    },
  });
  assert.equal(await readLimitedRequestBody(request(split), bytes.length), '"á"');

  let reads = 0;
  let cancelled = false;
  const oversized = new ReadableStream({
    pull(controller) {
      reads += 1;
      controller.enqueue(new Uint8Array(6));
    },
    cancel() { cancelled = true; },
  }, { highWaterMark: 0 });
  await assert.rejects(readLimitedRequestBody(request(oversized), 10), PayloadTooLargeError);
  assert.equal(reads, 2);
  assert.equal(cancelled, true);
});

test("both intake handlers reject oversized chunked payloads and invalid requests without provider calls", async (t) => {
  let providerCalls = 0;
  t.mock.method(globalThis, "fetch", async () => { providerCalls += 1; throw new Error("unexpected provider call"); });

  for (const [handler, maxBytes] of [[inquiryPost, 24_000], [specialistPost, 16_000]]) {
    let cancelled = false;
    const body = new ReadableStream({
      pull(controller) { controller.enqueue(new Uint8Array(maxBytes + 1)); },
      cancel() { cancelled = true; },
    }, { highWaterMark: 0 });
    const oversized = await handler(request(body));
    assert.equal(oversized.status, 413);
    assert.equal((await oversized.json()).message, "payload_too_large");
    assert.equal(cancelled, true);

    assert.equal((await handler(request("{}", { origin: "https://attacker.example" }))).status, 403);
    assert.equal((await handler(request("{}", { "content-type": "text/plain" }))).status, 415);
    const array = await handler(request("[]"));
    assert.equal(array.status, 400);
    assert.equal((await array.json()).message, "invalid_json");
  }
  assert.equal(providerCalls, 0);
});

test("CRM and email delivery do not forward a POST body through a provider redirect", async (t) => {
  const previous = {
    hosts: process.env.RCP_CRM_ALLOWED_HOSTS,
    resend: process.env.RESEND_API_KEY,
  };
  process.env.RCP_CRM_ALLOWED_HOSTS = "crm.example.test";
  process.env.RESEND_API_KEY = "synthetic-test-key";
  t.after(() => {
    for (const [name, value] of [["RCP_CRM_ALLOWED_HOSTS", previous.hosts], ["RESEND_API_KEY", previous.resend]]) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  });

  let redirectedRequests = 0;
  const server = createServer((req, res) => {
    req.resume();
    req.on("end", () => {
      if (req.url === "/sink") {
        redirectedRequests += 1;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ recorded: true, reference: "synthetic-reference", id: "synthetic-provider-id" }));
      } else {
        res.writeHead(307, { Location: "/sink" });
        res.end();
      }
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const nativeFetch = globalThis.fetch;
  const testUrl = `http://127.0.0.1:${server.address().port}/redirect`;
  // Keep native Fetch redirect behavior; only replace the external destination
  // with this isolated local server. All credentials and records are synthetic.
  t.mock.method(globalThis, "fetch", (_url, options) => nativeFetch(testUrl, options));

  assert.equal(await deliverCrm({
    url: "https://crm.example.test/intake",
    token: "synthetic-token",
    hmacSecret: "synthetic-hmac-secret",
    idempotencyKey: "synthetic-idempotency",
    body: { reference: "synthetic-reference" },
  }), null);
  assert.equal((await deliverEmail({
    idempotencyKey: "synthetic-email-key",
    from: "sender@example.test",
    to: "recipient@example.test",
    subject: "Synthetic verification",
    content: "Synthetic test content",
  })).accepted, false);
  assert.equal(redirectedRequests, 0);
});

test("limiter bounds unique identities, preserves existing limits and reclaims expired capacity", async (t) => {
  const { consumeRateLimit } = await import(`../lib/server/rate-limit.ts?capacity=${Date.now()}`);
  let now = 1_000_000;
  t.mock.method(Date, "now", () => now);
  const client = (index) => ({ headers: new Headers({ "x-forwarded-for": `synthetic-client-${index}` }) });
  for (let start = 0; start < 10_000; start += 250) {
    const results = await Promise.all(Array.from({ length: 250 }, (_, offset) => consumeRateLimit(client(start + offset), "test")));
    assert.ok(results.every((result) => result.allowed));
  }
  const saturated = await consumeRateLimit(client(10_000), "test");
  assert.equal(saturated.allowed, false);
  assert.ok(saturated.retryAfter > 0);
  for (let count = 1; count < 8; count += 1) {
    assert.equal((await consumeRateLimit(client(0), "test")).allowed, true);
  }
  assert.equal((await consumeRateLimit(client(0), "test")).allowed, false);
  now += 600_001;
  assert.equal((await consumeRateLimit(client(10_000), "test")).allowed, true);
});

test("production intake verifies Turnstile before delivery and only confirms a provider acknowledgment", async (t) => {
  const environment = {
    NODE_ENV: "production",
    TURNSTILE_SECRET_KEY: "synthetic-turnstile-secret",
    RESEND_API_KEY: "synthetic-resend-key",
    RCP_INTAKE_DELIVERY_MODE: "email",
    RCP_INQUIRY_EMAIL_FROM: "sender@example.test",
    RCP_INQUIRY_EMAIL_TO: "intake@example.test",
    RCP_SPECIALIST_EMAIL_TO: "specialists@example.test",
  };
  const previous = Object.fromEntries(Object.keys(environment).map((name) => [name, process.env[name]]));
  Object.assign(process.env, environment);
  t.after(() => {
    for (const [name, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[name]; else process.env[name] = value;
    }
  });
  let verificationStatus = 503;
  let verificationHostname = "rcp.services";
  let providerId = "synthetic-provider-id";
  const calls = [];
  t.mock.method(globalThis, "fetch", async (url, options) => {
    calls.push(url);
    if (url === "https://challenges.cloudflare.com/turnstile/v0/siteverify") {
      assert.equal(new URLSearchParams(options.body).get("response"), "x".repeat(2_048), "valid maximum-length tokens must reach Siteverify intact");
      return Response.json({ success: true, hostname: verificationHostname }, { status: verificationStatus });
    }
    assert.equal(url, "https://api.resend.com/emails");
    return Response.json(providerId ? { id: providerId } : {});
  });
  const common = { name: "Synthetic test", email: "test@example.test", consent: true, turnstileToken: "x".repeat(2_048) };
  const cases = [
    [inquiryPost, { ...common, company: "Synthetic company", need: "ordenar", sector: "comercio", problem: "Synthetic problem long enough for intake validation.", expectedOutcome: "Synthetic expected outcome.", contactPreference: "email" }],
    [specialistPost, { ...common, category: "consultoria", availability: "por-proyecto", experience: "Synthetic professional experience used only for local security verification." }],
  ];
  for (const [handler, payload] of cases) {
    calls.length = 0;
    const oversizedToken = await handler(request(JSON.stringify({ ...payload, turnstileToken: "x".repeat(2_049) })));
    assert.equal(oversizedToken.status, 400);
    assert.equal((await oversizedToken.json()).message, "human_verification_failed");
    assert.equal(calls.length, 0, "oversized tokens must be rejected before provider calls");

    calls.length = 0;
    verificationStatus = 503;
    const failedVerification = await handler(request(JSON.stringify(payload)));
    assert.equal(failedVerification.status, 400);
    assert.equal((await failedVerification.json()).message, "human_verification_failed");
    assert.equal(calls.length, 1, "failed verification must prevent email delivery");

    calls.length = 0;
    verificationStatus = 200;
    verificationHostname = "attacker.example";
    const wrongHostname = await handler(request(JSON.stringify(payload)));
    assert.equal(wrongHostname.status, 400);
    assert.equal((await wrongHostname.json()).message, "human_verification_failed");
    assert.equal(calls.length, 1, "tokens from other hostnames must not reach email delivery");

    calls.length = 0;
    verificationStatus = 200;
    verificationHostname = "rcp.services";
    providerId = "";
    const unconfirmed = await handler(request(JSON.stringify(payload)));
    assert.equal(unconfirmed.status, 503);
    assert.equal((await unconfirmed.json()).recorded, false);

    calls.length = 0;
    providerId = "synthetic-provider-id";
    const confirmed = await handler(request(JSON.stringify(payload)));
    assert.equal(confirmed.status, 202);
    const result = await confirmed.json();
    assert.equal(result.recorded, true);
    assert.equal(result.accepted, true);
    assert.equal(calls.length, 2);
    assert.doesNotMatch(JSON.stringify(result), /synthetic-(?:turnstile-secret|resend-key|provider-id)/);
  }
});
