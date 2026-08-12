import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";

const root = process.cwd();
const expected = new Map([
  ["public/assets/brand/mascot/rcp-mascot-official-views.png", "66393032fdb4c0c4ca8517bd5eab44df6d9fd9806f014fd87e15657b22d32bd3"],
  ["public/assets/brand/mascot/rcp-mascot-angles.png", "e55e10ecfa9086974eee14c2a849a2f93b466dc2ecbcc8a0adf7d0ab3803bc1d"],
]);

const webPoses = new Map([
  ["public/assets/brand/mascot/pulso-presenta-v1.png", "e366f36acb645ae4cd5977d50d71f96a5f8ed04910ff2b16404e93ad0862c66c"],
  ["public/assets/brand/mascot/pulso-orienta-v1.png", "70c0c93240f126132dfd581b833f50c75ed97958f367bfc59bb196f8b594d3ff"],
  ["public/assets/brand/mascot/pulso-avanza-v1.png", "a26b6f0373fa6e813795985826c60dfc43e5862979e72e0e26bbedabfdd046e1"],
]);

test("Pulso web masters match the approved canonical hashes", async () => {
  for (const [relativePath, expectedHash] of expected) {
    const bytes = await readFile(path.join(root, relativePath));
    const actual = createHash("sha256").update(bytes).digest("hex");
    assert.equal(actual, expectedHash, `${relativePath} drifted from its approved master`);
  }
});

test("Pulso approved web poses remain versioned and deterministic", async () => {
  for (const [relativePath, expectedHash] of webPoses) {
    const bytes = await readFile(path.join(root, relativePath));
    const actual = createHash("sha256").update(bytes).digest("hex");
    assert.equal(actual, expectedHash, `${relativePath} drifted from its reviewed web pose`);
  }
});

test("Pulso uses independent contained scenes instead of a cropped sprite", async () => {
  const [component, css] = await Promise.all([
    readFile(path.join(root, "components", "pulso.tsx"), "utf8"),
    readFile(path.join(root, "app", "globals.css"), "utf8"),
  ]);
  for (const scene of ["idle", "progress", "present", "analyze", "consider"]) {
    assert.match(component, new RegExp(`${scene}:`));
  }
  for (const relativePath of webPoses.keys()) {
    assert.match(component, new RegExp(path.basename(relativePath).replaceAll(".", "\\.")));
  }
  assert.doesNotMatch(component, /background-position|--pulso-position|--pulso-sheet/);
  assert.match(css, /\.pulso__image\s*{\s*object-fit:\s*contain/);
  assert.match(css, /\.pulso__frame[\s\S]*?overflow:\s*visible/);
  assert.doesNotMatch(component, /fetch\(|imagegen|generat/i);
});

test("motion has an accessible reduced-motion fallback", async () => {
  const css = await readFile(path.join(root, "app", "globals.css"), "utf8");
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /animation-duration:\s*\.01ms/);
});
