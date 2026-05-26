import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const webNodeModules = fileURLToPath(new URL("./node_modules/", import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      react: `${webNodeModules}react`,
      "react-dom": `${webNodeModules}react-dom`,
      "react/jsx-dev-runtime": `${webNodeModules}react/jsx-dev-runtime.js`,
      "react/jsx-runtime": `${webNodeModules}react/jsx-runtime.js`
    },
    dedupe: ["react", "react-dom"]
  },
  server: {
    port: 5173,
    host: "127.0.0.1"
  }
});
