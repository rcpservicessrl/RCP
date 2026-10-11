import assert from "node:assert/strict";
import test from "node:test";
import { readPreference, writePreference } from "../lib/browser-preferences.ts";

function withWindow(value, run) {
  const previous = Object.getOwnPropertyDescriptor(globalThis, "window");
  Object.defineProperty(globalThis, "window", { configurable: true, value });
  try {
    run();
  } finally {
    if (previous) Object.defineProperty(globalThis, "window", previous);
    else delete globalThis.window;
  }
}

test("preferences retain values when browser storage is available", () => {
  const values = new Map();
  withWindow({ localStorage: {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  } }, () => {
    assert.equal(readPreference("rcp-theme"), null);
    writePreference("rcp-theme", "light");
    assert.equal(readPreference("rcp-theme"), "light");
  });
});

test("blocked storage and exhausted quota cannot break client interactions", () => {
  withWindow({ get localStorage() { throw new DOMException("Storage disabled", "SecurityError"); } }, () => {
    assert.equal(readPreference("rcp-consent-v2"), null);
    assert.doesNotThrow(() => writePreference("rcp-theme", "light"));
  });
  withWindow({ localStorage: {
    getItem: () => { throw new DOMException("Access denied", "SecurityError"); },
    setItem: () => { throw new DOMException("Storage full", "QuotaExceededError"); },
  } }, () => {
    assert.equal(readPreference("rcp-music-volume"), null);
    assert.doesNotThrow(() => writePreference("rcp-music-time", "15"));
  });
});

test("server rendering does not require a browser storage object", () => {
  withWindow(undefined, () => {
    assert.equal(readPreference("rcp-theme"), null);
    assert.doesNotThrow(() => writePreference("rcp-theme", "light"));
  });
});
