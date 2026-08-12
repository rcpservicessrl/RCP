import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

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
  assert.doesNotMatch(form, /type="file"/);
  assert.doesNotMatch(endpoint, /console\.|portfolioUrl.*subject|experience.*subject/);
});

test("legacy specialist routes redirect directly to their canonical replacements", async () => {
  const config = await read("next.config.ts");
  assert.match(config, /source: "\/carreras", destination: "\/especialistas", permanent: true/);
  assert.match(config, /source: "\/en\/careers", destination: "\/en\/specialists", permanent: true/);
  assert.match(config, /source: "\/carreras\.html", destination: "\/especialistas", permanent: true/);
});
