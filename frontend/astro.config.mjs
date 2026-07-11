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
    // the public sitemap, along with the noindex'd tour-bus-request page.
    // Matches "/portal" itself and any "/portal/..." sub-path (not just
    // "/portal/", which trailingSlash:"never" means the index page no longer has).
    //
    // /tour-bus/usa, /tour-bus/usa/ny, etc. (country/state filter pages) are
    // useful on-site navigation but intentionally noindex'd — see the
    // `noindex` logic in TourBusListingPage.astro — so they're kept out of
    // the sitemap too. The plain /tour-bus listing, its numbered pages
    // (/tour-bus/2, /tour-bus/3, ...), and individual entry pages
    // (/tour-bus/nyc-icons) are unaffected since none of them start with
    // "/tour-bus/usa" or "/tour-bus/canada".
    sitemap({
      filter: (page) =>
        !/\/portal(\/|$)/.test(page) &&
        !page.includes("/tour-bus/request") &&
        !/\/tour-bus\/(usa|canada)(\/|$)/.test(page),
    }),
  ],
});
