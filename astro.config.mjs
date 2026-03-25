import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import icon from "astro-icon";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  site: 'https://blog.sanna.ninja',
  integrations: [sitemap(), react(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
});
