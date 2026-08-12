import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();

test("inquiry delivery is server-side and never exposes provider credentials", async () => {
  const route = await readFile(path.join(root, "app", "api", "inquiries", "route.ts"), "utf8");
  const delivery = await readFile(path.join(root, "lib", "server", "delivery.ts"), "utf8");
  const client = await readFile(path.join(root, "components", "diagnosis-form.tsx"), "utf8");
  assert.match(client, /fetch\("\/api\/inquiries"/);
  assert.doesNotMatch(client, /service.?role|SUPABASE_SERVICE|RCP_CRM_INGEST_TOKEN/i);
  assert.doesNotMatch(route, /NEXT_PUBLIC_.*(?:TOKEN|SECRET|SERVICE)/i);
  assert.match(route, /RCP_CRM_INGEST_TOKEN/);
  assert.match(route, /validIdempotencyKey/);
  assert.match(route, /Cache-Control": "no-store"/);
  assert.match(route, /byteLength\(body\)/);
  assert.match(delivery, /RESEND_API_KEY/);
  assert.match(delivery, /createHmacSignature/);
  assert.doesNotMatch(client, /RESEND_API_KEY/);
});

test("public form excludes sensitive identity and financial fields", async () => {
  const client = await readFile(path.join(root, "components", "diagnosis-form.tsx"), "utf8");
  for (const forbiddenName of ["rnc", "cedula", "certificate", "contract", "financialStatement", "password"]) {
    assert.doesNotMatch(client, new RegExp(`name=["']${forbiddenName}["']`, "i"));
  }
});

test("private and operational routes stay out of the sitemap", async () => {
  const sitemap = await readFile(path.join(root, "app", "sitemap.ts"), "utf8");
  for (const route of ["/portal", "/en/portal", "/dashboard", "/onboarding", "/checkout", "/en/request", "/propuesta-inversion"]) {
    assert.equal(sitemap.includes(`["${route}"`), false, `${route} must not be indexable`);
  }
});

test("public canonical routes required for migration parity are present in the sitemap", async () => {
  const sitemap = await readFile(path.join(root, "app", "sitemap.ts"), "utf8");
  for (const route of ["/servicios", "/diagnostico", "/nosotros", "/media", "/especialistas", "/privacidad", "/en/services", "/en/diagnosis", "/en/about", "/en/media", "/en/specialists", "/en/privacy"]) {
    assert.equal(sitemap.includes(`["${route}"`), true, `${route} must be discoverable`);
  }
  for (const legacyRoute of ["/carreras", "/en/careers"]) {
    assert.equal(sitemap.includes(`["${legacyRoute}"`), false, `${legacyRoute} is a redirect and must not be indexed`);
  }
});

test("legacy quote review never restores obsolete public pricing", async () => {
  const review = await readFile(path.join(root, "components", "quote-review.tsx"), "utf8");
  assert.match(review, /no reutilizamos precios|do not reuse obsolete prices/);
  assert.doesNotMatch(review, /RD\$|price_min|price_max|precio_inicial/);
});
