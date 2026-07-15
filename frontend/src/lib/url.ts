// Prefixes an internal, root-relative path (e.g. "/contact") with the
// configured base path so links keep working when the site is deployed
// under a subpath (GitHub Pages project sites: /<repo>/...). When `base`
// is "/" (the real-domain build), this is a no-op passthrough — nothing
// here needs to change when astro.config.mjs switches to the real domain.
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL;
  if (base === "/" || base === "") return path;
  return base.endsWith("/") ? base + path.replace(/^\//, "") : base + path;
}
