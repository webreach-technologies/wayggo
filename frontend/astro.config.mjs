// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wayggo.com",

  vite: {
    plugins: [tailwindcss()],
    resolve: {
      dedupe: ["react", "react-dom", "react/jsx-runtime", "react/jsx-dev-runtime"],
    },
  },

  integrations: [
    react(),
    // Portal pages are a login-gated dashboard with mock data — excluded from
    // the public sitemap, along with the noindex'd package-request page.
    sitemap({
      filter: (page) => !page.includes("/portal/") && !page.includes("/packages/request"),
    }),
  ],
});