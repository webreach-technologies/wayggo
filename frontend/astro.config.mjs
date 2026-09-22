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
    // Every /tour-bus bucket (all / country / country+state) is indexable on
    // its own page 1 — /tour-bus, /tour-bus/usa, /tour-bus/usa/ny, and
    // individual entry pages (/tour-bus/nyc-icons) all stay in. Only page 2+
    // of any bucket is excluded, since it's a duplicate re-slice of content
    // that's already indexed elsewhere — see the `noindex` logic in
    // TourBusListingPage.astro. Those paginated URLs always end in a plain
    // numeric segment ("/2", "/usa/2", "/usa/ny/3", ...), which real slugs
    // can never collide with (see assertNoReservedSlugConflicts in
    // tourBusBuckets.ts), so matching on that trailing segment is safe.
    sitemap({
      filter: (page) =>
        !/\/portal(\/|$)/.test(page) &&
        !page.includes("/tour-bus/request") &&
        !/\/tour-bus\/(?:[^/]+\/)*\d+\/?$/.test(page),
    }),
  ],
});
