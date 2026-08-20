import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");

test("RC2 separates commercial availability, technical maturity and professional review", async () => {
  const [types, content, catalogSelection, capabilitySelection] = await Promise.all([
    read("lib/types.ts"),
    read("lib/content.ts"),
    read("lib/catalog-selection.ts"),
    read("lib/capability-selection.ts"),
  ]);

  assert.match(types, /CommercialState[\s\S]*?"public"[\s\S]*?"contextual"[\s\S]*?"under_review"[\s\S]*?"in_development"[\s\S]*?"historical"/);
  assert.match(types, /TechnicalMaturity[\s\S]*?"proven"[\s\S]*?"accelerator"[\s\S]*?"pattern"[\s\S]*?"design"/);
  assert.match(types, /regulated:\s*boolean/);
  assert.match(types, /requiresProfessionalReview:\s*boolean/);
  assert.match(content, /export const catalog = catalogInternal\.filter/);
  assert.match(content, /export const selectableCatalog = catalog\.filter/);
  assert.match(catalogSelection, /selectableCatalog/);
  assert.match(capabilitySelection, /selectableCapabilities/);
});

test("legal services and internal CRM cannot leak into public selectable content", async () => {
  const content = await read("lib/content.ts");
  for (const id of ["legal-corporativa", "formalizacion-empresarial", "contratos-politicas", "laboral-tss"]) {
    const start = content.indexOf(`item("${id}"`);
    assert.ok(start >= 0, `${id} must remain documented internally`);
    assert.match(content.slice(start, content.indexOf("\n", start)), /commercialState: "under_review"[\s\S]*selectable: false/);
  }
  const crmStart = content.indexOf('item("crm-marketing"');
  assert.match(content.slice(crmStart, content.indexOf("\n", crmStart)), /commercialState: "historical"[\s\S]*selectable: false/);
  assert.doesNotMatch(content.slice(content.indexOf("export const searchRecords")), /resource-portal/);
});

test("every public service surface comes from the filtered commercial catalog", async () => {
  const contentUrl = `${pathToFileURL(path.join(root, "lib/content.ts")).href}?commercial-policy=${Date.now()}`;
  const {
    catalogInternal,
    catalog,
    isPublicCommercialEntry,
    pillars,
    publicCatalogByPillar,
    searchRecords,
    selectableCatalog,
  } = await import(contentUrl);

  const restrictedItems = catalogInternal.filter((entry) => !isPublicCommercialEntry(entry));
  const restrictedIds = new Set(restrictedItems.map((entry) => entry.id));
  assert.ok(restrictedIds.has("legal-corporativa"));
  assert.ok(restrictedIds.has("formalizacion-empresarial"));
  assert.ok(restrictedIds.has("facturacion-electronica"));

  for (const entry of catalog) {
    assert.equal(restrictedIds.has(entry.id), false, `${entry.id} cannot enter the public catalog`);
    assert.ok(!entry.regulated || entry.requiresProfessionalReview, `${entry.id} needs its professional-review safeguard`);
  }
  for (const entry of selectableCatalog) {
    assert.equal(restrictedIds.has(entry.id), false, `${entry.id} cannot become selectable`);
    assert.equal(entry.selectable, true);
  }

  for (const pillar of pillars) {
    const projectedItems = publicCatalogByPillar[pillar.id];
    assert.deepEqual(
      projectedItems.map((entry) => entry.id),
      catalog.filter((entry) => entry.pillar === pillar.id).map((entry) => entry.id),
    );
    for (const service of pillar.services) {
      assert.ok(
        projectedItems.some((entry) => entry.title.es === service.es && entry.title.en === service.en),
        `${service.es} must originate in the filtered ${pillar.id} catalog`,
      );
    }
  }

  for (const id of restrictedIds) {
    assert.equal(searchRecords.some((record) => record.id === `service-${id}`), false, `${id} cannot enter search or the JSON index`);
    for (const items of Object.values(publicCatalogByPillar)) {
      assert.equal(items.some((entry) => entry.id === id), false, `${id} cannot enter a public pillar directory`);
    }
  }

  const [content, home, directory, editorial, search, indexRoute, diagnosis, catalogExplorer] = await Promise.all([
    read("lib/content.ts"),
    read("components/home-experience.tsx"),
    read("components/service-directory.tsx"),
    read("components/editorial-page.tsx"),
    read("components/search-palette.tsx"),
    read("app/catalog-index.json/route.ts"),
    read("components/diagnosis-form.tsx"),
    read("components/catalog-explorer.tsx"),
  ]);

  assert.match(content, /catalogInternal\.filter\(isPublicCommercialEntry\)/);
  assert.match(content, /services:\s*publicCatalogByPillar\[pillar\.id\][\s\S]*?\.map\(\(entry\) => entry\.title\)/);
  assert.match(home, /selectedPillar\.services\.map/);
  assert.match(directory, /publicCatalogByPillar\[pillar\.id\]/);
  assert.doesNotMatch(directory, /catalog\.filter\(\(entry\) => entry\.pillar === pillar\.id\)/);
  assert.match(editorial, /pillar\.services\.slice\(0, 3\)\.map/);
  assert.match(search, /import \{ searchRecords, t \} from "@\/lib\/content"/);
  assert.match(indexRoute, /records:\s*searchRecords/);
  assert.match(diagnosis, /selectableCatalog\.filter/);
  assert.match(diagnosis, /selectedServices = selectedItems\.map\(\(item\) => item\.id\)\.join\(","\)/);
  assert.match(catalogExplorer, /catalog\.filter/);
  assert.match(catalogExplorer, /selectableCatalog\.find/);
  assert.match(catalogExplorer, /disabled=\{!entry\.selectable/);

  const publicSurfaceSources = [home, directory, editorial, search, indexRoute, diagnosis, catalogExplorer];
  for (const restricted of restrictedItems) {
    for (const source of publicSurfaceSources) {
      assert.equal(source.includes(restricted.title.es), false, `${restricted.id} Spanish title leaked into a public surface`);
      assert.equal(source.includes(restricted.title.en), false, `${restricted.id} English title leaked into a public surface`);
    }
  }
});

test("e-CF remains educational and unavailable for contracting", async () => {
  const [content, page] = await Promise.all([read("lib/content.ts"), read("components/information-page.tsx")]);
  const ecfStart = content.indexOf('item("facturacion-electronica"');
  const ecfItem = content.slice(ecfStart, content.indexOf("\n", ecfStart));
  assert.match(ecfItem, /commercialState: "in_development"/);
  assert.match(ecfItem, /selectable: false/);
  assert.match(page, /Integración en desarrollo/);
  assert.match(page, /Sin contratación disponible/);
  assert.match(page, /Orientación, no oferta de implementación/);
});

test("six human-first technology solutions precede the SSR glossary", async () => {
  const [content, explorer, spanishPage] = await Promise.all([
    read("lib/content.ts"),
    read("components/capability-explorer.tsx"),
    read("app/soluciones-tecnologicas/page.tsx"),
  ]);
  const solutionBlock = content.match(/export const technologySolutions:[\s\S]*?= \[([\s\S]*?)\n\];/);
  assert.ok(solutionBlock);
  assert.equal([...solutionBlock[1].matchAll(/^\s{4}id: "/gm)].length, 6);
  assert.match(explorer, /technologySolutions\.map/);
  assert.match(explorer, /glossaryCapabilities\.map/);
  assert.match(spanishPage, /"@type": "ItemList"/);
  assert.match(spanishPage, /"@type": "DefinedTermSet"/);
});

test("public navigation hides the private portal and typography is locally self-hosted", async () => {
  const [header, home, interior, help, layout, css] = await Promise.all([
    read("components/site-header.tsx"),
    read("components/home-experience.tsx"),
    read("components/interior-shell.tsx"),
    read("components/pulso-help.tsx"),
    read("app/layout.tsx"),
    read("app/globals.css"),
  ]);
  for (const source of [header, home, interior, help]) assert.doesNotMatch(source, /href=\{[^\n]*\/portal|href="\/portal"|Portal RCP/);
  assert.match(layout, /Montserrat, Space_Grotesk/);
  assert.doesNotMatch(layout, /fonts\.googleapis\.com|fonts\.gstatic\.com/);
  assert.match(css, /html \{[^\n]*font-size: 18px/);
  assert.match(css, /body \{[\s\S]*?font-weight: 500/);
  assert.match(css, /@media \(pointer: coarse\), \(hover: none\)[\s\S]*?\.cursor-halo \{ display: none; \}/);
});

test("approved secondary lockups are present with their canonical hashes", async () => {
  const expected = new Map([
    ["public/assets/brand/logos/logo_rcp_lockup_3p_claro.png", "1a917be764bd2fcb935742dbf8d82941f88a9ba3c279d3605e7ee87f1df79a5a"],
    ["public/assets/brand/logos/logo_rcp_lockup_3p_oscuro.png", "1883e774a952093314096a9f7ac3914743221aa32074f54b4e79b1f7812799a0"],
  ]);
  for (const [file, hash] of expected) {
    const bytes = await readFile(path.join(root, file));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), hash);
  }
});
