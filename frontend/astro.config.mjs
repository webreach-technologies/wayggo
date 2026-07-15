// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from "@tailwindcss/vite";
import react from "@astrojs/react";
import sitemap from "@astrojs/sitemap";

// Set by .github/workflows/deploy-gh-pages.yml only — a temporary preview
// build for the client while the real domain is undecided. It's served at
// https://<owner>.github.io/<repo>/, a subpath, so `site`/`base` need to
// point there instead of root. Once the real domain is confirmed, uncomment
// `site` below with that domain and this flag (and the workflow that sets
// it) can just go away — nothing else in the codebase depends on it, since
// internal links go through withBase() (see src/lib/url.ts).
const isGhPagesStaging = process.env.STAGING === "true";
const GH_PAGES_OWNER = "webreach-technologies";
const GH_PAGES_REPO = "wayggo";

// https://astro.build/config
export default defineConfig({
  // site: "https://wayggo.com", // domain not confirmed yet — set this once it is
  site: isGhPagesStaging ? `https://${GH_PAGES_OWNER}.github.io` : undefined,
  // Canonical URLs, the sitemap, and Astro.url all resolve without a trailing
  // slash (e.g. /about, not /about/) to match this setting.
  base: isGhPagesStaging ? `/${GH_PAGES_REPO}` : '/',
  // trailingSlash: "never",

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
