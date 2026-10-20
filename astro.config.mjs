// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import expressiveCode from "astro-expressive-code";
import remarkSidenotes from "./src/plugins/remark-sidenotes.ts";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    remarkPlugins: [remarkSidenotes],
  },

  integrations: [
    react(),
    // With a dark and a light theme, code blocks follow prefers-color-scheme.
    expressiveCode({ themes: ["tokyo-night", "catppuccin-latte"] }),
    mdx(),
  ],
});
