// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://wayggo.com",
  // Canonical URLs, the sitemap, and Astro.url all resolve without a trailing
  // slash (e.g. /about, not /about/) to match this setting.
  trailingSlash: "never",

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
    // Matches "/portal" itself and any "/portal/..." sub-path (not just
    // "/portal/", which trailingSlash:"never" means the index page no longer has).
    //
    // /packages/usa, /packages/usa/ny, etc. (country/state filter pages) are
    // useful on-site navigation but intentionally noindex'd — see the
    // `noindex` logic in PackagesListingPage.astro — so they're kept out of
    // the sitemap too. The plain /packages listing, its numbered pages
    // (/packages/2, /packages/3, ...), and individual package pages
    // (/packages/nyc-icons) are unaffected since none of them start with
    // "/packages/usa" or "/packages/canada".
    sitemap({
      filter: (page) =>
        !/\/portal(\/|$)/.test(page) &&
        !page.includes("/packages/request") &&
        !/\/packages\/(usa|canada)(\/|$)/.test(page),
    }),
  ],
});
