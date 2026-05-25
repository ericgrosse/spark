import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const publishDir = resolve("apps/web/dist");
const indexPath = resolve(publishDir, "index.html");
const redirectsPath = resolve(publishDir, "_redirects");

if (!existsSync(indexPath)) {
  throw new Error(`Netlify publish directory is missing index.html: ${indexPath}`);
}

if (!readFileSync(indexPath, "utf8").includes('<div id="root"></div>')) {
  throw new Error("Netlify index.html does not look like the Spark web app entry.");
}

if (!existsSync(redirectsPath)) {
  throw new Error(`Netlify publish directory is missing SPA redirects file: ${redirectsPath}`);
}

console.log(`Verified Netlify publish output: ${publishDir}`);
