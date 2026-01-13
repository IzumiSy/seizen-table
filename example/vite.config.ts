import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { vanillaExtractPlugin } from "@vanilla-extract/vite-plugin";
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
        rollupOptions: {
          external: ["react", "react-dom", "react/jsx-runtime"],
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
