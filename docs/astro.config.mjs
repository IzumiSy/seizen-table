// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import { createStarlightTypeDocPlugin } from "starlight-typedoc";
import starlightLlmsTxt from "starlight-llms-txt";

const demosUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:5184" : "/demos/";

const [pluginAPITypeDoc, pluginAPITypeDocSidebarGroup] =
  createStarlightTypeDocPlugin();
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
    starlight({
      title: "Seizen Table",
      customCss: ["./src/styles/custom.css"],
      plugins: [
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
          label: "Demos",
          link: demosUrl,
          attrs: { target: "_blank" },
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
