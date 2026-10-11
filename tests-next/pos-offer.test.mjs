import assert from "node:assert/strict";
import test, { after } from "node:test";
import { registerHooks } from "node:module";
import { pathToFileURL } from "node:url";
import path from "node:path";
import { posOffer, posOfferDiagnosisHref, posOfferStructuredData } from "../lib/pos-offer.ts";
import { catalog, selectableCatalog } from "../lib/content.ts";
const hooks = registerHooks({ resolve(specifier, context, next) { return next(specifier.startsWith("@/") ? pathToFileURL(path.join(process.cwd(), `${specifier.slice(2)}.ts`)).href : specifier, context); } });
after(() => hooks.deregister());
const { normalizeCatalogSelection } = await import("../lib/catalog-selection.ts");

test("POS implementation and optional support are distinct from licensing", () => {
  assert.deepEqual(posOffer.implementation, { startingPrice: 9900, currency: "DOP", cadence: "one-time" });
  assert.deepEqual(posOffer.accompaniment, { startingPrice: 1990, currency: "DOP", cadence: "monthly", optional: true });
  assert.match(posOffer.separateCosts.es, /licencia del sistema y el plan de emisión e-CF se cotizan aparte/);
  assert.match(posOffer.requirements.es, /habilitación del contribuyente.*certificado digital vigente/);
  assert.match(posOffer.terms.es, /costos iniciales y recurrentes/);
  assert.match(posOffer.terms.en, /setup and recurring costs/);
});

test("both POS calls to action preserve the available regulated service", () => {
  const service = catalog.find(entry => entry.id === "facturacion-electronica");
  assert.equal(service.requiresProfessionalReview, true);
  assert.ok(selectableCatalog.some(entry => entry.id === service.id));
  for (const locale of ["es", "en"]) {
    const url = new URL(posOfferDiagnosisHref(locale), "https://rcp.services");
    assert.equal(url.pathname, locale === "es" ? "/diagnostico" : "/en/diagnosis");
    assert.equal(url.hash, "#solicitud");
    assert.equal(url.searchParams.get("offer"), "SOFTWARE");
    assert.equal(url.searchParams.get(locale === "es" ? "capacidad" : "capability"), "pos");
    assert.deepEqual(normalizeCatalogSelection(url.searchParams.get(locale === "es" ? "servicios" : "services")), [service.id]);
  }
});

test("structured pricing describes a starting implementation fee with exclusions", () => {
  for (const locale of ["es", "en"]) {
    const schema = posOfferStructuredData(locale);
    assert.equal(schema["@type"], "Service");
    assert.equal(schema.provider.name, "RCP Services SRL");
    assert.equal(schema.offers.priceSpecification.minPrice, 9900);
    assert.equal(schema.offers.priceSpecification.priceCurrency, "DOP");
    assert.equal(schema.offers.price, undefined);
    assert.ok(schema.offers.description.includes(posOffer.separateCosts[locale]));
    assert.ok(schema.offers.url.endsWith("#pos-ecf"));
  }
});
