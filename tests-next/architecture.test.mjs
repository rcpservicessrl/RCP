import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const requiredFiles = [
  "next.config.ts",
  "open-next.config.ts",
  "wrangler.jsonc",
  "app/layout.tsx",
  "app/page.tsx",
  "app/en/page.tsx",
  "app/robots.ts",
  "app/sitemap.ts",
  "app/manifest.ts",
  "app/api/health/route.ts",
  "app/api/inquiries/route.ts",
  "app/catalog-index.json/route.ts",
  "app/servicios/page.tsx",
  "app/diagnostico/page.tsx",
  "app/nosotros/page.tsx",
  "app/media/page.tsx",
  "app/carreras/page.tsx",
  "app/privacidad/page.tsx",
  "app/terminos/page.tsx",
  "app/cookies/page.tsx",
  "app/accesibilidad/page.tsx",
  "app/en/services/page.tsx",
  "app/en/diagnosis/page.tsx",
  "app/en/about/page.tsx",
  "app/en/media/page.tsx",
  "app/en/careers/page.tsx",
  "app/checkout/page.tsx",
  "pnpm-lock.yaml",
  "pnpm-workspace.yaml",
];

test("Next and Cloudflare boundary files exist", async () => {
  await Promise.all(requiredFiles.map((file) => access(path.join(root, file))));
});

test("Cloudflare uses OpenNext and node compatibility", async () => {
  const wrangler = await readFile(path.join(root, "wrangler.jsonc"), "utf8");
  const openNext = await readFile(path.join(root, "open-next.config.ts"), "utf8");
  assert.match(wrangler, /\.open-next\/worker\.js/);
  assert.match(wrangler, /nodejs_compat/);
  assert.match(openNext, /defineCloudflareConfig/);
});

test("legacy service worker retires old caches during cutover", async () => {
  const worker = await readFile(path.join(root, "public", "service-worker.js"), "utf8");
  assert.match(worker, /caches\.keys\(\)/);
  assert.match(worker, /registration\.unregister\(\)/);
});

test("legacy Astro pages remain archived and cannot conflict with App Router", async () => {
  await access(path.join(root, "legacy", "astro-pages", "index.astro"));
  await assert.rejects(access(path.join(root, "src", "pages")));
  for (const file of ["sitemap.xml", "robots.txt", "llms.txt"]) {
    await access(path.join(root, "legacy", "astro-public", file));
    await assert.rejects(access(path.join(root, "public", file)));
  }
});

test("security headers include a restrictive browser boundary", async () => {
  const config = await readFile(path.join(root, "next.config.ts"), "utf8");
  assert.match(config, /Content-Security-Policy/);
  assert.match(config, /object-src 'none'/);
  assert.match(config, /frame-ancestors 'self'/);
  assert.match(config, /Permissions-Policy/);
  assert.match(config, /Strict-Transport-Security/);
});

test("pnpm permits native build scripts only for required runtime packages", async () => {
  const workspace = await readFile(path.join(root, "pnpm-workspace.yaml"), "utf8");
  assert.match(workspace, /nodeLinker: hoisted/);
  assert.match(workspace, /allowBuilds:/);
  assert.match(workspace, /esbuild: true/);
  assert.match(workspace, /workerd: true/);
  assert.doesNotMatch(workspace, /allowBuilds:\s*true/);
});

test("catalog selections reach the diagnosis through a validated server boundary", async () => {
  const selection = await readFile(path.join(root, "lib", "catalog-selection.ts"), "utf8");
  const spanishPage = await readFile(path.join(root, "app", "diagnostico", "page.tsx"), "utf8");
  const englishPage = await readFile(path.join(root, "app", "en", "diagnosis", "page.tsx"), "utf8");
  const form = await readFile(path.join(root, "components", "diagnosis-form.tsx"), "utf8");
  assert.match(selection, /catalogIds\.has/);
  assert.match(selection, /slice\(0, 4\)/);
  assert.match(spanishPage, /normalizeCatalogSelection/);
  assert.match(englishPage, /normalizeCatalogSelection/);
  assert.match(form, /selectedServiceIds\.join/);
  assert.doesNotMatch(form, /window\.location\.search/);
});

test("mobile navigation escapes the filtered header containing block", async () => {
  const header = await readFile(path.join(root, "components", "site-header.tsx"), "utf8");
  assert.match(header, /createPortal/);
  assert.match(header, /document\.body/);
  assert.match(header, /event\.key === "Escape"/);
  assert.match(header, /menuButtonRef\.current\?\.focus/);
});

test("delivery automation targets Vercel and requires an explicit production release", async () => {
  const pullRequest = await readFile(path.join(root, ".github", "workflows", "pull-request.yml"), "utf8");
  const deploy = await readFile(path.join(root, ".github", "workflows", "deploy.yml"), "utf8");
  const vercel = await readFile(path.join(root, "vercel.json"), "utf8");
  assert.match(pullRequest, /pnpm install --frozen-lockfile/);
  assert.match(deploy, /workflow_dispatch/);
  assert.match(deploy, /DEPLOY_RCP_SERVICES/);
  assert.match(deploy, /vercel@latest build --prod/);
  assert.match(deploy, /vercel@latest deploy --prebuilt --prod/);
  assert.match(deploy, /node-version: 24/);
  assert.doesNotMatch(deploy, /deploy-pages|github-pages|npm ci/i);
  assert.match(vercel, /"framework": "nextjs"/);
  assert.match(vercel, /"cleanUrls": false/);
  assert.doesNotMatch(vercel, /_astro/);
});
