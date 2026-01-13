import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import path from "path";

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  root: __dirname,
  base: "/seizen-table/demos/",
  build: {
    outDir: path.resolve(__dirname, "../dist/demos"),
  },
  server: {
    port: 5174,
  },
});
