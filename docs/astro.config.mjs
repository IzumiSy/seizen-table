// @ts-check
import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import react from "@astrojs/react";
import { createStarlightTypeDocPlugin } from "starlight-typedoc";

const demosUrl =
  process.env.NODE_ENV === "development" ? "http://localhost:5184" : "/demos/";

const [pluginAPITypeDoc, pluginAPITypeDocSidebarGroup] =
  createStarlightTypeDocPlugin();
const [datatableAPITypeDoc, datatableAPITypeDocSidebarGroup] =
  createStarlightTypeDocPlugin();

// https://astro.build/config
export default defineConfig({
  site: "https://izumisy.github.io",
  base: "/seizen-ui",
  vite: {
    resolve: {
      alias: {
        "@components": "/src/components",
      },
    },
  },
  integrations: [
    starlight({
      title: "Seizen DataTable",
      customCss: ["./src/styles/custom.css"],
      plugins: [
        pluginAPITypeDoc({
          entryPoints: ["../packages/datatable-react/src/plugin/index.ts"],
          tsconfig: "../packages/datatable-react/tsconfig.json",
          output: "generated/api/plugin",
          sidebar: {
            label: "Reference",
          },
        }),
        datatableAPITypeDoc({
          entryPoints: ["../packages/datatable-react/src/table/index.ts"],
          tsconfig: "../packages/datatable-react/tsconfig.json",
          output: "generated/api/datatable",
          sidebar: {
            label: "Reference",
          },
        }),
      ],
      social: [
        {
          icon: "github",
          label: "GitHub",
          href: "https://github.com/izumisy/seizen-ui",
        },
      ],
      sidebar: [
        { label: "Getting Started", slug: "getting-started" },
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
          label: "DataTable API",
          items: [datatableAPITypeDocSidebarGroup],
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
