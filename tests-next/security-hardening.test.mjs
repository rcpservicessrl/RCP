import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("active web intake fails closed and blocks cross-site abuse", async () => {
  const [security, inquiry, specialist, field] = await Promise.all([
    read("lib/server/request-security.ts"),
    read("app/api/inquiries/route.ts"),
    read("app/api/specialist-applications/route.ts"),
    read("components/turnstile-field.tsx"),
  ]);
  assert.match(security, /fetchSite === "cross-site"/);
  assert.match(security, /RCP_DEPLOYMENT_ENV === "production"/);
  assert.match(inquiry, /isAllowedRequestOrigin\(request\)/);
  assert.match(specialist, /isAllowedRequestOrigin\(request\)/);
  assert.match(field, /security verification is not available yet/);
});

test("server delivery has an explicit CRM host boundary and private handoff", async () => {
  const [security, delivery, inquiry] = await Promise.all([
    read("lib/server/request-security.ts"),
    read("lib/server/delivery.ts"),
    read("app/api/inquiries/route.ts"),
  ]);
  assert.match(security, /Reject every literal IPv4 or/);
  assert.match(security, /hostname\.startsWith\("\["\)/);
  assert.match(delivery, /isSafeCrmUrl\(input\.url\)/);
  assert.match(inquiry, /const whatsappMessage/);
  assert.doesNotMatch(inquiry, /inquiry\.problem\.slice/);
});

test("legacy and private application surfaces do not ship known credentials or PII logs", async () => {
  const legacyFiles = [
    "legacy/astro-public/tienda.js",
    "legacy/astro-public/scripts/dashboard.js",
    "legacy/astro-pages/portal.astro",
    "legacy/astro-pages/onboarding.astro",
    "legacy/astro-pages/formulario-contacto.astro",
    "legacy/astro-pages/checkout.astro",
    "legacy/astro-pages/carreras.astro",
  ];
  const [cloud, health, compose, litellm, ...legacy] = await Promise.all([
    read("cloud_function/main.py"),
    read("cloud_function/health_check.py"),
    read("cloud_function/products/ia-privada/docker-compose.yml"),
    read("cloud_function/products/ia-privada/litellm_config.yaml"),
    ...legacyFiles.map(read),
  ]);
  assert.doesNotMatch(cloud, /api_key\[:10\]/);
  assert.doesNotMatch(cloud, /Lead captured: \{/);
  assert.match(cloud, /N8N_ALLOWED_HOSTS/);
  assert.match(health, /SUPABASE_KEY = os\.getenv\('SUPABASE_KEY', ''\)/);
  assert.match(compose, /127\.0\.0\.1:4000:4000/);
  assert.match(compose, /LITELLM_MASTER_KEY=\$\{LITELLM_MASTER_KEY:\?/);
  assert.match(litellm, /os\.environ\/LITELLM_MASTER_KEY/);
  for (const source of legacy) assert.doesNotMatch(source, /sb_publishable_/);
});
