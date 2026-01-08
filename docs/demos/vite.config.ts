import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  root: __dirname,
  base: "/seizen-ui/demos/",
  build: {
    outDir: path.resolve(__dirname, "../dist/demos"),
  },
  server: {
    port: 5174,
  },
});
