import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { stripTypeScriptTypes } from "node:module";

const root = process.cwd();
const read = (relative) => readFile(path.join(root, relative), "utf8");

test("discovery bots can crawl public production routes while private and preview routes stay excluded", async () => {
  const source = stripTypeScriptTypes(await read("app/robots.ts"));
  const { default: robots } = await import(`data:text/javascript;base64,${Buffer.from(source).toString("base64")}`);
  const previous = process.env.RCP_DEPLOYMENT_ENV;
  try {
    process.env.RCP_DEPLOYMENT_ENV = "production";
    const { rules } = robots();
    const ruleFor = (bot) => rules.find((rule) => [].concat(rule.userAgent).includes(bot)) ?? rules.find((rule) => rule.userAgent === "*");
    for (const bot of ["Googlebot", "Google-Extended", "OAI-SearchBot", "PerplexityBot", "Bingbot", "DuckDuckBot", "Applebot", "Claude-SearchBot", "Claude-User", "YandexBot", "SeznamBot", "Yeti", "YepBot", "AhrefsBot", "Amzn-SearchBot", "Amzn-User"]) {
      const rule = ruleFor(bot);
      assert.equal(rule.allow, "/", `${bot} must discover public pages`);
      for (const route of ["/api/", "/portal", "/en/portal", "/checkout", "/en/request", "/private/"]) assert.ok(rule.disallow.includes(route), `${bot} must exclude ${route}`);
    }
    for (const bot of ["CCBot", "GPTBot", "ClaudeBot", "Bytespider", "Applebot-Extended", "Amazonbot", "UnknownBot"]) assert.equal(ruleFor(bot).disallow, "/", `${bot} must remain excluded`);
    process.env.RCP_DEPLOYMENT_ENV = "preview";
    assert.deepEqual(robots().rules, [{ userAgent: "*", disallow: "/" }]);
  } finally {
    if (previous === undefined) delete process.env.RCP_DEPLOYMENT_ENV;
    else process.env.RCP_DEPLOYMENT_ENV = previous;
  }
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
    read("lib/structured-data.ts"),
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
