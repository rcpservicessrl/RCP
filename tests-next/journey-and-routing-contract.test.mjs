import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

const informationPages = [
  { kind: "renewal", es: "/servicios/renovacion", en: "/en/services/renewal" },
  { kind: "consulting", es: "/servicios/consultoria", en: "/en/services/consulting" },
  { kind: "advertising", es: "/servicios/publicidad", en: "/en/services/advertising" },
  { kind: "howWeWork", es: "/como-trabajamos", en: "/en/how-we-work" },
  { kind: "sectors", es: "/sectores", en: "/en/sectors" },
  { kind: "customSoftware", es: "/software-a-la-medida", en: "/en/custom-software" },
  { kind: "electronicInvoicing", es: "/facturacion-electronica", en: "/en/electronic-invoicing" },
  { kind: "contact", es: "/contacto", en: "/en/contact" },
  { kind: "resources", es: "/recursos", en: "/en/resources" },
];

test("selected technology context is validated before it reaches the inquiry provider", async () => {
  const [explorer, selection, solutionSelection, spanishRoute, englishRoute, diagnosisPage, form, endpoint] = await Promise.all([
    read("components/capability-explorer.tsx"),
    read("lib/capability-selection.ts"),
    read("lib/solution-selection.ts"),
    read("app/diagnostico/page.tsx"),
    read("app/en/diagnosis/page.tsx"),
    read("components/diagnosis-page.tsx"),
    read("components/diagnosis-form.tsx"),
    read("app/api/inquiries/route.ts"),
  ]);

  assert.match(explorer, /technologySolutions\.map/);
  assert.match(explorer, /href=\{t\(solution\.href, locale\)\}/);
  assert.match(selection, /selectableCapabilities\.some\(\(entry\) => entry\.id === normalized\)/);
  assert.match(solutionSelection, /solutionIds\.has\(normalized\)/);
  assert.match(spanishRoute, /selectedCapabilityId=\{normalizeCapabilitySelection\(params\.capacidad \?\? params\.capability\)\}/);
  assert.match(englishRoute, /selectedCapabilityId=\{normalizeCapabilitySelection\(params\.capability \?\? params\.capacidad\)\}/);
  assert.match(diagnosisPage, /selectedCapabilityId=\{selectedCapabilityId\}/);
  assert.match(diagnosisPage, /selectedSolutionId=\{selectedSolutionId\}/);

  const hiddenField = form.indexOf('name="selectedCapability" value={selectedCapability?.id ?? ""}');
  const formData = form.indexOf("new FormData(form)");
  const payload = form.indexOf("Object.fromEntries(data.entries())");
  const request = form.indexOf('fetch("/api/inquiries"');
  const requestBody = form.indexOf("body: JSON.stringify(payload)");
  assert.ok(hiddenField >= 0, "the selected capability must be serialized as a form field");
  assert.ok(formData >= 0 && payload > formData && request > payload && requestBody > request, "the form field must reach the inquiry request body");

  assert.match(endpoint, /normalizeCapabilitySelection\(text\(raw\.selectedCapability, 80\)\)/);
  assert.match(endpoint, /normalizeSolutionSelection\(text\(raw\.selectedSolution, 80\)\)/);
  assert.match(endpoint, /const commonRecord = \{/);
});

test("Turnstile is optional by default and enforced consistently when enabled", async () => {
  const [environment, field, form, endpoint, config] = await Promise.all([
    read(".env.example"),
    read("components/turnstile-field.tsx"),
    read("components/diagnosis-form.tsx"),
    read("app/api/inquiries/route.ts"),
    read("next.config.ts"),
  ]);

  assert.match(environment, /^RCP_REQUIRE_TURNSTILE=false$/m);
  assert.match(environment, /^NEXT_PUBLIC_TURNSTILE_SITE_KEY=$/m);
  assert.match(environment, /^TURNSTILE_SECRET_KEY=$/m);

  assert.match(field, /if \(!siteKey\) return <input type="hidden" name="turnstileToken" value="" readOnly \/>/);
  assert.match(field, /https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit/);
  assert.match(field, /sitekey: siteKey/);
  assert.match(field, /callback: \(nextToken: string\) => setToken\(nextToken\)/);
  assert.match(field, /name="turnstileToken" value=\{token\}/);
  assert.doesNotMatch(field, /TURNSTILE_SECRET_KEY/);

  assert.match(form, /<TurnstileField locale=\{locale\} resetSignal=\{verificationReset\} \/>/);
  assert.match(form, /setVerificationReset\(\(current\) => current \+ 1\)/);

  assert.match(endpoint, /if \(process\.env\.RCP_REQUIRE_TURNSTILE !== "true"\) return true/);
  assert.match(endpoint, /const secret = process\.env\.TURNSTILE_SECRET_KEY/);
  assert.match(endpoint, /verifyTurnstile\(text\(raw\.turnstileToken, 2_000\)\)/);
  assert.match(endpoint, /if \(!secret \|\| !token\) return false/);
  assert.match(endpoint, /https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/siteverify/);
  assert.match(endpoint, /new URLSearchParams\(\{ secret, response: token \}\)/);
  assert.match(endpoint, /return result\.success === true/);
  assert.match(endpoint, /if \(!await verifyTurnstile\(text\(raw\.turnstileToken, 2_000\)\)\) return invalid\("human_verification_failed"\)/);
  assert.doesNotMatch(endpoint, /NEXT_PUBLIC_TURNSTILE_SITE_KEY/);

  assert.match(config, /const scriptPolicy =[^\n]*https:\/\/challenges\.cloudflare\.com/);
  assert.match(config, /`script-src \$\{scriptPolicy\}`/);
  assert.match(config, /frame-src[^\n]*https:\/\/challenges\.cloudflare\.com/);
});

test("new bilingual information pages declare canonical locale pairs and stay discoverable", async () => {
  const [informationPage, metadataHelper, sitemap] = await Promise.all([
    read("components/information-page.tsx"),
    read("lib/metadata.ts"),
    read("app/sitemap.ts"),
  ]);

  assert.match(informationPage, /const canonical = t\(config\.paths, locale\)/);
  assert.match(informationPage, /createPublicPageMetadata\(\{[\s\S]*canonical,[\s\S]*paths: config\.paths/);
  assert.match(metadataHelper, /canonical,\s*languages: \{ "es-DO": paths\.es, "en-US": paths\.en \}/);
  assert.match(metadataHelper, /openGraph: \{[\s\S]*url: canonical/);

  for (const { kind, es, en } of informationPages) {
    const [spanishPage, englishPage] = await Promise.all([
      read(`app${es}/page.tsx`),
      read(`app${en}/page.tsx`),
    ]);
    assert.ok(informationPage.includes(`paths: lt("${es}", "${en}")`), `${kind} must define matching locale paths`);
    assert.ok(spanishPage.includes(`getInformationPageMetadata("${kind}", "es")`), `${es} must emit Spanish canonical metadata`);
    assert.ok(spanishPage.includes(`<InformationPage locale="es" page="${kind}" />`), `${es} must render the expected page`);
    assert.ok(englishPage.includes(`getInformationPageMetadata("${kind}", "en")`), `${en} must emit English canonical metadata`);
    assert.ok(englishPage.includes(`<InformationPage locale="en" page="${kind}" />`), `${en} must render the expected page`);
    assert.ok(sitemap.includes(`["${es}"`), `${es} must be discoverable`);
    assert.ok(sitemap.includes(`["${en}"`), `${en} must be discoverable`);
  }
});

test("the documented legacy redirect map stays in exact parity with Next config", async () => {
  const [csv, config] = await Promise.all([
    read("docs/REDIRECT_MAP.csv"),
    read("next.config.ts"),
  ]);
  const documented = csv.trim().split(/\r?\n/).slice(1).map((line) => {
    const [source, destination, status] = line.split(",");
    assert.ok(status === "307" || status === "308", `${source} has an unsupported redirect status`);
    return { source, destination, permanent: status === "308" };
  });
  assert.equal(new Set(documented.map(({ source }) => source)).size, documented.length, "redirect documentation cannot contain duplicate sources");

  const redirectsStart = config.indexOf("async redirects()");
  assert.ok(redirectsStart >= 0, "Next config must define redirects");
  const configured = [...config.slice(redirectsStart).matchAll(/\{\s*source:\s*"([^"]+)",\s*destination:\s*"([^"]+)",\s*permanent:\s*(true|false)\s*\}/g)]
    .map((match) => ({ source: match[1], destination: match[2], permanent: match[3] === "true" }));
  assert.equal(new Set(configured.map(({ source }) => source)).size, configured.length, "Next config cannot contain duplicate redirect sources");
  assert.equal(configured.length, documented.length, "Next config and redirect documentation must contain the same number of redirects");

  const configuredBySource = new Map(configured.map((entry) => [entry.source, entry]));
  for (const expected of documented) {
    assert.deepEqual(configuredBySource.get(expected.source), expected, `${expected.source} must preserve its documented target and status`);
  }
});
