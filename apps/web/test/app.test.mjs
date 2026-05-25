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

test("web app buttons and forms trigger actions", () => {
  const app = readFileSync(new URL("../src/App.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(app, /<button>Message<\/button>/);
  assert.doesNotMatch(app, /<button>Review<\/button>/);
  assert.doesNotMatch(app, /<button className="danger">Delete account<\/button>/);
  assert.match(app, /aria-label="Notifications"[\s\S]*?onClick=/);
  assert.match(app, /className="composer"[\s\S]*?onSubmit=/);
  assert.match(app, /api<\{ token: string \}>\("\/auth\/login"/);
  assert.match(app, /api\("\/swipes"/);
  assert.match(app, /api\("\/messages"/);
  assert.match(app, /api\("\/me"/);
  assert.match(app, /role="status"/);
});

test("web app styles visible action feedback", () => {
  const styles = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

  assert.match(styles, /\.status-bar/);
  assert.match(styles, /\.notification-panel/);
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
