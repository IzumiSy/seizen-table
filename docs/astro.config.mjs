import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import { createStarlightTypeDocPlugin } from "starlight-typedoc";
import starlightLlmsTxt from "starlight-llms-txt";
import starlightLinksValidator from "starlight-links-validator";
import { execSync } from "node:child_process";
import fs from "node:fs";

const [pluginAPITypeDoc, pluginAPITypeDocSidebarGroup] =
  createStarlightTypeDocPlugin();

// Copy demo assets from example package to public/demos
function copyDemosAssets() {
  const copy = () => {
    const src = "node_modules/@izumisy/seizen-table-example/dist-app/assets";
    const dest = "public/demos/assets";

    if (fs.existsSync("public/demos")) {
      fs.rmSync("public/demos", { recursive: true });
    }
    fs.mkdirSync("public/demos", { recursive: true });

    if (fs.existsSync(src)) {
      execSync(`cp -r ${src} ${dest}`);
    }
  };

  return {
    name: "copy-demos-assets",
    hooks: {
      "astro:config:setup": () => copy(),
    },
  };
}
const [tableAPITypeDoc, tableAPITypeDocSidebarGroup] =
  createStarlightTypeDocPlugin();

// https://astro.build/config
export default defineConfig({
  site: "https://izumisy.github.io",
  base: "/seizen-table",
  vite: {
    resolve: {
      alias: {
        "@components": "/src/components",
      },
    },
  },
  integrations: [
    copyDemosAssets(),
    starlight({
      title: "Seizen Table",
      customCss: ["./src/styles/custom.css"],
      plugins: [
        starlightLinksValidator(),
        starlightLlmsTxt({
          rawContent: true,
        }),
        pluginAPITypeDoc({
          entryPoints: ["../packages/core/src/plugin/index.ts"],
          tsconfig: "../packages/core/tsconfig.json",
          output: "generated/api/plugin",
          sidebar: {
            label: "Reference",
          },
        }),
        tableAPITypeDoc({
          entryPoints: ["../packages/core/src/table/index.ts"],
          tsconfig: "../packages/core/tsconfig.json",
          output: "generated/api/table",
          sidebar: {
            label: "Reference",
          },
        }),
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/izumisy/seizen-table",
        },
      ],
      sidebar: [
        {
          label: "Getting Started",
          items: [
            { label: "Overview", slug: "overview" },
            { label: "Installation", slug: "installation" },
          ],
        },
        {
          label: "Guides",
          autogenerate: { directory: "guides" },
        },
        {
          label: "Features",
          autogenerate: { directory: "features" },
        },
        {
          label: "Advanced",
          autogenerate: { directory: "advanced" },
        },
        {
          label: "Table API",
          items: [tableAPITypeDocSidebarGroup],
        },
        {
          label: "Plugin API",
          items: [pluginAPITypeDocSidebarGroup],
        },
      ],
    }),
    react(),
  ],
});
