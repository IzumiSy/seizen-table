import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDeps } from "vite-plugin-externalize-deps";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    externalizeDeps(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  build: {
    lib: {
      entry: {
        filter: "./src/filter/index.ts",
        "column-control": "./src/column-control/index.ts",
        "file-export": "./src/file-export/index.ts",
        "row-detail": "./src/row-detail/index.ts",
        "all-slots-demo": "./src/all-slots-demo/index.ts",
        "preset-filter": "./src/preset-filter/index.ts",
        remote: "./src/remote/index.ts",
      },
      formats: ["es"],
    },
  },
});
