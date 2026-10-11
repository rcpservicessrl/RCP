import assert from "node:assert/strict";
import { access } from "node:fs/promises";
import test from "node:test";
import { catalogArt, productArt } from "../lib/product-art.ts";

test("catalog illustrations distinguish the service instead of repeating generic software art", () => {
  for (const [id, category, pillar, expected] of [
    ["procesos-operativos", "procesos", "renovacion", "processes"],
    ["formacion-intervencion", "adopcion", "renovacion", "training"],
    ["branding-identidad", "marca", "publicidad", "branding"],
    ["contenido-multimedia", "contenido", "publicidad", "content"],
    ["gran-formato", "exterior", "publicidad", "gran-formato"],
    ["uniformes-textiles", "merchandising", "publicidad", "textiles"],
    ["consultoria-impositiva", "impositiva", "consultoria", "tax"],
    ["sitios-web", "digital", "publicidad", "web"],
    ["papeleria-corporativa", "impresos", "publicidad", "papeleria-corporativa"],
  ]) assert.equal(catalogArt(id, category, pillar), expected);
});

test("every catalog illustration is shipped with the website", async () => {
  for (const file of Object.values(productArt)) await access(`public${file}`);
});
