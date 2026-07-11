import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import { assertNoReservedSlugConflicts } from "./packageBuckets";

export * from "./packageBuckets";

export interface PackageCard {
  id: string;
  detailHref: string;
  name: string;
  days: number;
  size: string;
  price: string;
  vehicle: string;
  iconKey: "van" | "bus" | "fullbus" | "motorcoach";
  image: ImageMetadata | null;
  gradientStyle: string;
  country: string;
  state: string;
  cities: string[];
  highlights: string[];
  included: string[];
}

export async function loadPackageCards(): Promise<PackageCard[]> {
  const entries = await getCollection("packages");
  assertNoReservedSlugConflicts(entries.map((e) => e.id));
  return entries.map((entry) => ({
    id: entry.id,
    detailHref: `/packages/${entry.id}`,
    name: entry.data.name,
    days: entry.data.days,
    size: entry.data.size,
    price: entry.data.price,
    vehicle: entry.data.vehicle,
    iconKey: entry.data.iconKey,
    image: entry.data.cardImage ?? null,
    gradientStyle: entry.data.cardGradient,
    country: entry.data.country,
    state: entry.data.state,
    cities: entry.data.cities,
    highlights: entry.data.cardHighlights,
    included: entry.data.included,
  }));
}
