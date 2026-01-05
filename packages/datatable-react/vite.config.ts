import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfigPaths from "vite-tsconfig-paths";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
import cssInjectedByJsPlugin from "vite-plugin-css-injected-by-js";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    vanillaExtractPlugin(),
    externalizeDeps(),
    cssInjectedByJsPlugin({
      jsAssetsFilterFunction: (outputChunk) =>
        ["index", "plugin"].includes(outputChunk.name),
    }),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        index: "./src/table/index.ts",
        plugin: "./src/plugin/index.ts",
      },
      formats: ["es"],
    },
  },
});
