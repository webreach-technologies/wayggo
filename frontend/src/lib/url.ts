// Page URLs on this site end in a trailing slash ("/about/"), matching the
// canonical URLs and `trailingSlash: "always"` in astro.config.mjs. Adds the
// slash to a root-relative path, ahead of any "?query" or "#hash". Paths to
// files ("/favicon.svg") are left alone.
export function withTrailingSlash(path: string): string {
  const splitAt = path.search(/[?#]/);
  const pathname = splitAt === -1 ? path : path.slice(0, splitAt);
  const suffix = splitAt === -1 ? "" : path.slice(splitAt);
  const lastSegment = pathname.slice(pathname.lastIndexOf("/") + 1);
  if (pathname.endsWith("/") || lastSegment.includes(".")) return path;
  return `${pathname}/${suffix}`;
}

// Prefixes an internal, root-relative path (e.g. "/contact") with the
// configured base path so links keep working when the site is deployed
// under a subpath (GitHub Pages project sites: /<repo>/...), and gives page
// links their trailing slash. When `base` is "/" (the real-domain build) the
// prefix is a no-op — nothing here needs to change when astro.config.mjs
// switches to the real domain.
export function withBase(path: string): string {
  const target = withTrailingSlash(path);
  const base = import.meta.env.BASE_URL;
  if (base === "/" || base === "") return target;
  return base.endsWith("/") ? base + target.replace(/^\//, "") : base + target;
}
