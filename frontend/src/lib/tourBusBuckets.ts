// Pure bucket/URL/SEO logic for the /tour-bus listing pages — no astro:content
// import, so this module is safe to use from astro.config.mjs (which runs
// outside Astro's content-collection runtime) as well as from pages/components.

export const PAGE_SIZE = 9;

export const usStates = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
  "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
  "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
  "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC",
];

export const caProvinces = [
  "AB", "BC", "MB", "NB", "NL", "NS", "ON", "PE", "QC", "SK", "NT", "NU", "YT",
];

export interface CountryConfig {
  code: "USA" | "Canada";
  slug: string;
  label: string;
  states: string[];
}

export const countries: CountryConfig[] = [
  { code: "USA", slug: "usa", label: "USA", states: usStates },
  { code: "Canada", slug: "canada", label: "Canada", states: caProvinces },
];

// Single-segment route names the pagination system owns: /tour-bus/usa,
// /tour-bus/canada, and /tour-bus/2, /tour-bus/3, ... (page numbers for the
// "all tour bus" bucket). An entry file whose slug matches one of these
// would collide with those routes at build time.
const RESERVED_SLUGS = new Set(countries.map((c) => c.slug));

export function assertNoReservedSlugConflicts(entryIds: string[]) {
  for (const id of entryIds) {
    if (RESERVED_SLUGS.has(id) || /^\d+$/.test(id)) {
      throw new Error(
        `Tour bus file "${id}.md" has a slug that conflicts with a reserved /tour-bus route ` +
          `("usa", "canada", or a plain page number). Rename the file so its slug is more ` +
          `specific, e.g. "${id}-tour.md".`
      );
    }
  }
}

/** Minimal shape needed to bucket/filter entries — satisfied by TourBusCard in tourBus.ts. */
export interface BucketableCard {
  country: string;
  state: string;
}

/** A filter bucket: all tour buses, a country, or a country+state combo. */
export interface Bucket {
  /** URL path relative to /tour-bus, e.g. "", "usa", "usa/ny". */
  basePath: string;
  country: CountryConfig["code"] | null;
  state: string | null;
  /** Human label used in headings/breadcrumbs, e.g. "USA", "USA · NY". */
  label: string;
}

const ALL_BUCKET: Bucket = { basePath: "", country: null, state: null, label: "All Tour Bus" };

/** Every bucket this site paginates: all tour buses, each country, and each state/province within it. */
export function getBuckets(): Bucket[] {
  const buckets: Bucket[] = [ALL_BUCKET];
  for (const country of countries) {
    buckets.push({ basePath: country.slug, country: country.code, state: null, label: country.label });
    for (const state of country.states) {
      buckets.push({
        basePath: `${country.slug}/${state.toLowerCase()}`,
        country: country.code,
        state,
        label: `${country.label} · ${state}`,
      });
    }
  }
  return buckets;
}

export function filterCards<T extends BucketableCard>(cards: T[], bucket: Bucket): T[] {
  return cards.filter((card) => {
    const matchesCountry = !bucket.country || card.country === bucket.country;
    const matchesState = !bucket.state || card.state === bucket.state;
    return matchesCountry && matchesState;
  });
}

/** Site-relative URL for a given bucket + 1-based page number. */
export function bucketPageHref(bucket: Bucket, page: number): string {
  const segments = [bucket.basePath, page > 1 ? String(page) : null].filter(
    (s): s is string => !!s
  );
  return segments.length === 0 ? "/tour-bus" : `/tour-bus/${segments.join("/")}`;
}

export function bucketSeo(bucket: Bucket, page: number, totalInBucket: number) {
  const pageSuffix = page > 1 ? ` — Page ${page}` : "";
  const plural = (n: number) => (n === 1 ? "" : "es");

  if (!bucket.country) {
    return {
      title: `Group Tour Bus — WAYGGO North America Ground Transportation${pageSuffix}`,
      description:
        "Ready-to-book group tour bus itineraries for international travelers across the USA and Canada. Motorcoaches, buses, and vans included.",
      badge: `${totalInBucket} Ready-to-Book Tour Bus${plural(totalInBucket)}`,
    };
  }
  if (!bucket.state) {
    return {
      title: `${bucket.country} Group Tour Bus — WAYGGO${pageSuffix}`,
      description: `Ready-to-book group tour bus itineraries in ${bucket.country} for international travelers. Motorcoaches, buses, and vans included.`,
      badge: `${totalInBucket} ${bucket.country} Tour Bus${plural(totalInBucket)}`,
    };
  }
  return {
    title: `${bucket.country} · ${bucket.state} Group Tour Bus — WAYGGO${pageSuffix}`,
    description: `Ready-to-book group tour bus itineraries in ${bucket.state}, ${bucket.country} for international travelers. Motorcoaches, buses, and vans included.`,
    badge: `${totalInBucket} ${bucket.country} · ${bucket.state} Tour Bus${plural(totalInBucket)}`,
  };
}

export function bucketBreadcrumbs(bucket: Bucket): { name: string; path: string }[] {
  const crumbs = [{ name: "Tour Bus", path: "/tour-bus" }];
  if (bucket.country) {
    const country = countries.find((c) => c.code === bucket.country)!;
    crumbs.push({ name: country.label, path: `/tour-bus/${country.slug}` });
    if (bucket.state) {
      crumbs.push({ name: bucket.state, path: `/tour-bus/${country.slug}/${bucket.state.toLowerCase()}` });
    }
  }
  return crumbs;
}
