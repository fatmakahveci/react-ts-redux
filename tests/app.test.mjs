import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("the application mounts Redux at the page boundary", async () => {
  const page = await readFile("src/app/page.tsx", "utf8");

  assert.match(page, /<Provider store=\{store\}>/);
  assert.match(page, /<App \/>/);
});

test("the store combines counter and authentication state", async () => {
  const store = await readFile("src/app/store/index.tsx", "utf8");

  assert.match(store, /counter/);
  assert.match(store, /auth/);
  assert.match(store, /configureStore/);
});
