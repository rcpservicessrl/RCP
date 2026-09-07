import assert from "node:assert/strict";
import test from "node:test";
import { alternateRoute, localizedRoutes } from "../lib/localized-routes.ts";
import { canonicalSolution, normalizeBusinessSector } from "../lib/discovery-context.ts";

test("every localized route returns to its corresponding page", () => {
  for (const [es, en] of localizedRoutes) {
    assert.equal(alternateRoute(es, "es"), en);
    assert.equal(alternateRoute(en, "en"), es);
  }
  assert.equal(new Set(localizedRoutes.flat()).size, localizedRoutes.length * 2);
});

test("language switching preserves discovery choices without forwarding arbitrary data", () => {
  assert.equal(alternateRoute("/diagnostico", "es", "?servicios=sitios-web,branding&necesidad=crecer&sector=comercio&email=private%40example.com&token=secret"), "/en/diagnosis?services=sitios-web%2Cbranding&need=crecer&sector=comercio");
  assert.equal(alternateRoute("/en/custom-software", "en", "?solution=sales-inventory"), "/software-a-la-medida?solucion=sales-inventory");
  assert.equal(alternateRoute("/catalogo", "es", "?servicio=%3Cscript%3E"), "/en/catalog");
});

test("assessment sector rejects repeated query parameters and unsupported values", () => {
  for (const sector of ["comercio", "servicios", "imprenta", "otro"]) assert.equal(normalizeBusinessSector(sector), sector);
  for (const invalid of [undefined, null, ["comercio"], {}, "__proto__", "retail"]) assert.equal(normalizeBusinessSector(invalid), undefined);
});

test("English solution links resolve to canonical selections and malformed values are safe", () => {
  for (const [en, canonical] of [["sales-inventory", "ventas-inventario"], ["organize-operations", "organiza-operacion"], ["automation-data", "automatizacion-datos"], ["managed-operations", "operacion-administrada"]]) assert.equal(canonicalSolution(en), canonical);
  assert.equal(canonicalSolution(" VENTAS-INVENTARIO "), "ventas-inventario");
  for (const invalid of [undefined, null, ["sales-inventory"], {}, "  "]) assert.equal(canonicalSolution(invalid), undefined);
  assert.equal(canonicalSolution("__proto__"), "__proto__");
});
