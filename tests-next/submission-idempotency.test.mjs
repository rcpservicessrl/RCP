import assert from "node:assert/strict";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const root = process.cwd();

test("submission identity ignores anti-abuse fields but rotates for business changes", async () => {
  const moduleUrl = `${pathToFileURL(path.join(root, "lib/submission-idempotency.ts")).href}?test=${Date.now()}`;
  const { fingerprintSubmissionPayload, resolveSubmissionIdempotency } = await import(moduleUrl);
  const basePayload = {
    locale: "es",
    name: "Cliente de prueba",
    company: "Negocio de prueba",
    problem: "Necesitamos organizar el seguimiento comercial.",
    turnstileToken: "token-one",
    website: "",
  };
  const antiAbuseRefresh = {
    ...basePayload,
    turnstileToken: "token-two",
    website: "bot-noise",
  };
  const businessChange = {
    ...antiAbuseRefresh,
    problem: "Necesitamos organizar el inventario y el punto de venta.",
  };

  const baseFingerprint = await fingerprintSubmissionPayload(basePayload);
  const refreshedFingerprint = await fingerprintSubmissionPayload(antiAbuseRefresh);
  const changedFingerprint = await fingerprintSubmissionPayload(businessChange);
  assert.match(baseFingerprint, /^[a-f0-9]{64}$/);
  assert.equal(refreshedFingerprint, baseFingerprint, "Turnstile and honeypot changes must remain one semantic request");
  assert.notEqual(changedFingerprint, baseFingerprint, "business changes need a new semantic request");

  let generated = 0;
  const createKey = () => `request-${++generated}`;
  const firstAttempt = resolveSubmissionIdempotency(null, baseFingerprint, createKey);
  const antiAbuseRetry = resolveSubmissionIdempotency(firstAttempt, refreshedFingerprint, createKey);
  assert.strictEqual(antiAbuseRetry, firstAttempt);
  assert.equal(generated, 1);

  const changedAttempt = resolveSubmissionIdempotency(antiAbuseRetry, changedFingerprint, createKey);
  assert.notEqual(changedAttempt.key, firstAttempt.key);
  assert.equal(generated, 2);

  const afterConfirmedSuccess = resolveSubmissionIdempotency(null, changedFingerprint, createKey);
  assert.notEqual(afterConfirmedSuccess.key, changedAttempt.key);
  assert.equal(generated, 3);
});
