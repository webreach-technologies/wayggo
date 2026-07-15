import type { APIRoute } from "astro";

// Dynamic so the GitHub Pages preview build (STAGING=true, see
// astro.config.mjs) can block crawling entirely, while the real deploy
// keeps the normal Allow/Sitemap rules — driven by the same one flag as
// everything else staging-related.
export const GET: APIRoute = ({ site }) => {
  const isStaging = import.meta.env.STAGING === "true";

  const body = isStaging
    ? "User-agent: *\nDisallow: /\n"
    : [
        "User-agent: *",
        "Allow: /",
        "Disallow: /portal/",
        "",
        `Sitemap: ${new URL("sitemap-index.xml", site ?? "https://wayggo.com").href}`,
        "",
      ].join("\n");

  return new Response(body, {
    headers: { "Content-Type": "text/plain" },
  });
};
