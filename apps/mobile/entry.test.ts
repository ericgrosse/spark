import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";

const mobileRoot = resolve(fileURLToPath(new URL(".", import.meta.url)));

describe("Expo entry point", () => {
  it("uses a workspace-local entry instead of hoisted expo/AppEntry", () => {
    const packageJson = JSON.parse(readFileSync(resolve(mobileRoot, "package.json"), "utf8"));

    expect(packageJson.main).toBe("index.js");
  });

  it("registers the root App from the mobile workspace", () => {
    const entry = readFileSync(resolve(mobileRoot, "index.js"), "utf8");

    expect(entry).toContain('from "expo"');
    expect(entry).toContain('from "./App"');
    expect(entry).toContain("registerRootComponent(App)");
  });
});
