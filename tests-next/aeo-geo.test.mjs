import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("AEO robots allow selected discovery bots and reject mass-training bots", async () => {
  const robots = await read("app/robots.ts");
  for (const bot of ["Googlebot", "Google-Extended", "OAI-SearchBot", "PerplexityBot"]) assert.match(robots, new RegExp(`"${bot}"`));
  for (const bot of ["CCBot", "GPTBot", "ClaudeBot"]) assert.match(robots, new RegExp(`"${bot}"`));
  assert.match(robots, /userAgent: "\*",\s*disallow: "\/"/);
});

test("private application surfaces emit crawler exclusion headers", async () => {
  const config = await read("next.config.ts");
  assert.match(config, /X-Robots-Tag.*noindex, nofollow, noarchive, nosnippet/);
  for (const route of ["/api/:path*", "/app/:path*", "/portal/:path*", "/checkout/:path*", "/private/:path*"]) assert.match(config, new RegExp(route.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
});

test("public content uses a request nonce and exposes business service semantics", async () => {
  const [layout, jsonLd, home, services] = await Promise.all([
    read("app/layout.tsx"),
    read("components/json-ld.tsx"),
    read("app/page.tsx"),
    read("app/servicios/page.tsx"),
  ]);
  assert.match(layout, /next\/headers/);
  assert.match(layout, /headers\(\)/);
  assert.match(layout, /nonce=\{nonce\}/);
  assert.doesNotMatch(jsonLd, /next\/headers|headers\(/);
  assert.match(layout, /theme-init\.js/);
  assert.match(home, /ProfessionalService/);
  assert.match(home, /BusinessAudience/);
  assert.match(home, /hasOfferCatalog/);
  assert.match(services, /"@type": "Service"/);
});
