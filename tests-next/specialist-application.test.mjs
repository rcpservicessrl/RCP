import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { runInNewContext } from "node:vm";
import { loadBindings, transform } from "next/dist/build/swc/index.js";

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

test("specialist overview and application routes exist in both languages", async () => {
  await Promise.all([
    "app/especialistas/page.tsx",
    "app/especialistas/postular/page.tsx",
    "app/en/specialists/page.tsx",
    "app/en/specialists/apply/page.tsx",
    "app/api/specialist-applications/route.ts",
  ].map((file) => access(path.join(root, file))));

  const pages = (await Promise.all([
    "app/especialistas/page.tsx",
    "app/especialistas/postular/page.tsx",
    "app/en/specialists/page.tsx",
    "app/en/specialists/apply/page.tsx",
  ].map(read))).join("\n");
  for (const route of ["/especialistas", "/especialistas/postular", "/en/specialists", "/en/specialists/apply"]) {
    assert.match(pages, new RegExp(route.replaceAll("/", "\\/")));
  }
});

test("specialist application success requires provider confirmation in email and CRM modes", async () => {
  const [route, delivery] = await Promise.all([
    read("app/api/specialist-applications/route.ts"),
    read("lib/server/delivery.ts"),
  ]);

  assert.match(route, /RCP_CRM_SPECIALIST_INGEST_URL/);
  assert.match(route, /RCP_CRM_SPECIALIST_INGEST_TOKEN/);
  assert.doesNotMatch(route, /NEXT_PUBLIC_.*SPECIALIST/);
  assert.match(route, /if \(text\(raw\.website, 200\)\)[^\n]*discarded: true/);
  assert.match(route, /if \(!confirmation \|\| confirmation\.reference !== reference\)[^\n]*accepted: false, recorded: false/);
  assert.match(route, /if \(!delivery\.accepted\)[^\n]*accepted: false, recorded: false/);
  assert.match(route, /return Response\.json\(\{ accepted: true, recorded: true, registered: true/);
  assert.match(delivery, /response\.ok && providerId\.length > 0/);
});

test("failed specialist submissions preserve form data and expose only a safe mail fallback", async () => {
  const [form, endpoint] = await Promise.all([
    read("components/specialist-application-form.tsx"),
    read("app/api/specialist-applications/route.ts"),
  ]);
  const successGuard = form.indexOf("response.ok && result.accepted === true && result.recorded === true");
  const reset = form.indexOf("form.reset()");

  assert.ok(successGuard >= 0 && reset > successGuard, "the form may reset only after confirmed success");
  assert.equal(form.match(/form\.reset\(\)/g)?.length, 1);
  assert.match(form, /state === "error"[\s\S]*?fallbackHref/);
  assert.match(form, /mailto:\$\{fallbackEmail\}/);
  assert.match(endpoint, /mailto:\$\{fallbackEmail\}\?subject=/);
  assert.match(form, /const fallbackEmail = "info@rcp\.services"/);
  assert.match(endpoint, /const fallbackEmail = "info@rcp\.services"/);
  assert.doesNotMatch(`${form}\n${endpoint}`, /talento@rcp\.services/);
  assert.doesNotMatch(form, /type="file"/);
  assert.doesNotMatch(endpoint, /console\.|portfolioUrl.*subject|experience.*subject/);
});

test("legacy specialist routes redirect directly to their canonical replacements", async () => {
  const config = await read("next.config.ts");
  assert.match(config, /source: "\/carreras", destination: "\/especialistas", permanent: true/);
  assert.match(config, /source: "\/en\/careers", destination: "\/en\/specialists", permanent: true/);
  assert.match(config, /source: "\/carreras\.html", destination: "\/especialistas", permanent: true/);
});

test("specialist retries preserve their key until the submitted content changes or succeeds", async () => {
  const source = await read("components/specialist-application-form.tsx");
  const helpers = await import(pathToFileURL(path.join(root, "lib/submission-idempotency.ts")).href);
  await loadBindings();
  const { code: compiled } = await transform(source, {
    filename: "specialist-application-form.tsx",
    jsc: { parser: { syntax: "typescript", tsx: true }, target: "es2022", transform: { react: { runtime: "automatic" } } },
    module: { type: "commonjs" },
  });
  const exports = {};
  const requests = [];
  let confirmed = false;
  let resetCount = 0;
  const jsx = (type, props) => ({ type, props });
  const modules = {
    react: { useState: (initial) => [initial, () => {}], useRef: (current) => ({ current }) },
    "react/jsx-runtime": { jsx, jsxs: jsx },
    "next/link": { default: "a" },
    "@/components/turnstile-field": { TurnstileField: "turnstile" },
    "@/lib/submission-idempotency": helpers,
    "./specialist-application-page.module.css": { default: {} },
  };
  runInNewContext(compiled, {
    exports,
    require: (name) => {
      assert.ok(name in modules, `Unexpected component dependency: ${name}`);
      return modules[name];
    },
    FormData: class { constructor(form) { return form.data; } },
    fetch: async (url, options) => {
      assert.equal(url, "/api/specialist-applications");
      requests.push({ key: options.headers["Idempotency-Key"], payload: JSON.parse(options.body) });
      return Response.json(
        { accepted: confirmed, recorded: confirmed, ...(confirmed ? { reference: "TEST-REFERENCE" } : {}) },
        { status: confirmed ? 202 : 503 },
      );
    },
  });
  const form = {
    data: new FormData(),
    reset: () => { resetCount++; },
  };
  for (const [name, value] of Object.entries({
    name: "Test applicant", email: "test@example.com", category: "consultoria",
    experience: "Experience in business analysis and project delivery.",
    portfolioUrl: "", availability: "por-proyecto", consent: "true", website: "", turnstileToken: "first-token",
  })) form.data.set(name, value);
  const rendered = exports.SpecialistApplicationForm({ locale: "es" });
  assert.equal(rendered.type, "form");
  const submit = () => rendered.props.onSubmit({ preventDefault() {}, currentTarget: form });

  await submit();
  form.data.set("turnstileToken", "renewed-token");
  await submit();
  assert.equal(requests[1].key, requests[0].key, "human verification refresh must keep the original request identity");
  assert.equal(resetCount, 0, "unconfirmed submissions must preserve the form");

  form.data.set("experience", "Updated experience in software development and consulting.");
  await submit();
  assert.notEqual(requests[2].key, requests[1].key, "editing the application must use a fresh provider key");
  assert.notEqual(requests[2].payload.experience, requests[1].payload.experience);

  confirmed = true;
  await submit();
  assert.equal(requests[3].key, requests[2].key, "unchanged retry must keep the edited request identity");
  assert.equal(resetCount, 1);
  await submit();
  assert.notEqual(requests[4].key, requests[3].key, "confirmed success must retire the request identity");
});
