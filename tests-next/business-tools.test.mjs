import assert from "node:assert/strict";
import test from "node:test";
import { estimateMonthlyTime, normalizeNeed } from "../lib/business-tools.ts";

test("time scenarios use the visitor's inputs and preserve zero reduction", () => {
  assert.deepEqual(estimateMonthlyTime(10, 6, 22, 25), { current: 22, potential: 5.5 });
  assert.deepEqual(estimateMonthlyTime(1, 60, 1, 0), { current: 1, potential: 0 });
  assert.deepEqual(estimateMonthlyTime(500, 120, 31, 100), { current: 31000, potential: 31000 });
});
test("invalid, incomplete and fractional count inputs cannot produce misleading estimates", () => {
  for (const inputs of [[NaN,6,22,25],[10,Infinity,22,25],[0,6,22,25],[501,6,22,25],[10,121,22,25],[10,6,32,25],[10,6,22,-1],[10,6,22,101],[1.5,6,22,25],[10,6,1.5,25]]) assert.equal(estimateMonthlyTime(...inputs), null);
});
test("assessment query accepts only supported priorities and rejects arrays or injected content", () => {
  for (const value of ["ordenar", "cumplir", "crecer"]) assert.equal(normalizeNeed(value), value);
  for (const value of [undefined,null,"", "arbitrary", ["ordenar"], {need:"crecer"}, "<script>"]) assert.equal(normalizeNeed(value), undefined);
});
