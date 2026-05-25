import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

const main = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
const preload = readFileSync(new URL("../src/preload.cjs", import.meta.url), "utf8");

test("Electron renderer uses secure defaults", () => {
  assert.match(main, /contextIsolation:\s*true/);
  assert.match(main, /nodeIntegration:\s*false/);
  assert.match(main, /sandbox:\s*true/);
  assert.match(main, /preload:/);
});

test("Electron blocks unsafe navigation and permission prompts", () => {
  assert.match(main, /setWindowOpenHandler/);
  assert.match(main, /will-navigate/);
  assert.match(main, /setPermissionRequestHandler/);
  assert.match(main, /callback\(false\)/);
});

test("preload exposes a narrow bridge only", () => {
  assert.match(preload, /contextBridge\.exposeInMainWorld/);
  assert.doesNotMatch(preload, /ipcRenderer/);
});
