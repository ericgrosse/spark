import { readFileSync } from "node:fs";
import { test } from "node:test";
import assert from "node:assert/strict";

test("web app exposes the core cross-platform product surfaces", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

  for (const surface of ["Discover", "Matches", "Chat", "Privacy", "Moderation"]) {
    assert.match(app, new RegExp(surface));
  }
});

test("web app keeps the shared mobile-first navigation controls", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /@media \(max-width: 780px\)/);
  assert.match(styles, /\.profile-card/);
});

test("Netlify publishes the web app with an index page", () => {
  const netlifyConfig = readFileSync(new URL("../../../netlify.toml", import.meta.url), "utf8");
  const rootPackage = readFileSync(new URL("../../../package.json", import.meta.url), "utf8");
  const redirects = readFileSync(new URL("../public/_redirects", import.meta.url), "utf8");

  assert.match(netlifyConfig, /publish = "apps\/web\/dist"/);
  assert.match(netlifyConfig, /to = "\/index\.html"/);
  assert.match(rootPackage, /@spark\/web run build/);
  assert.match(rootPackage, /verify-netlify-output/);
  assert.equal(redirects.trim(), "/* /index.html 200");
});
