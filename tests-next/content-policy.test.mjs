import assert from "node:assert/strict";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const sourceRoots = ["app", "components", "lib"];

async function filesUnder(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const relative = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await filesUnder(relative));
    else if (/\.(?:ts|tsx|css)$/.test(entry.name)) files.push(relative);
  }
  return files;
}

test("public copy avoids superseded business claims", async () => {
  const files = (await Promise.all(sourceRoots.map(filesUnder))).flat();
  const banned = [
    /agencia 360/gi,
    /ecosistema soberano/gi,
    /once capas/gi,
    /11 capas/gi,
    /gratis para siempre/gi,
    /automatizaci[oó]n total/gi,
    /resultados garantizados/gi,
    /software 100% del cliente/gi,
    /leopardo/gi,
  ];

  for (const file of files) {
    const content = await readFile(path.join(root, file), "utf8");
    for (const pattern of banned) {
      assert.equal(pattern.test(content), false, `${file} contains superseded claim ${pattern}`);
      pattern.lastIndex = 0;
    }
  }
});

test("technology remains transversal instead of a fourth pillar", async () => {
  const content = await readFile(path.join(root, "lib", "content.ts"), "utf8");
  const pillarIds = [...content.matchAll(/id: "(renovacion|consultoria|publicidad)"/g)].map((match) => match[1]);
  assert.ok(pillarIds.includes("renovacion"));
  assert.ok(pillarIds.includes("consultoria"));
  assert.ok(pillarIds.includes("publicidad"));
  assert.equal(/id: "tecnologia"/.test(content), false);
});

test("catalog does not publish rigid prices", async () => {
  const content = await readFile(path.join(root, "lib", "content.ts"), "utf8");
  assert.equal(/priceMin|priceMax|price_min|price_max|RD\$/.test(content), false);
});
