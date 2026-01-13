import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig(({ mode }) => {
  const isLib = mode === "lib";

  if (isLib) {
    // Library build mode - for exporting components to docs
    return {
      plugins: [
        react(),
        vanillaExtractPlugin(),
        externalizeDeps(),
        dts({
          include: ["src/index.ts", "src/components/**/*.tsx"],
          outDir: "dist",
        }),
      ],
      build: {
        lib: {
          entry: path.resolve(__dirname, "src/index.ts"),
          formats: ["es"],
          fileName: "index",
        },
        outDir: "dist",
        sourcemap: true,
      },
    };
  }

  // SPA dev/build mode - standalone demo app
  return {
    plugins: [react(), vanillaExtractPlugin()],
    root: __dirname,
    base: "/",
    build: {
      outDir: "dist-app",
    },
    server: {
      port: 5174,
    },
  };
});
