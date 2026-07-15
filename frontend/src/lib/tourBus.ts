import { getCollection } from "astro:content";
import type { ImageMetadata } from "astro";
import { assertNoReservedSlugConflicts } from "./tourBusBuckets";

export * from "./tourBusBuckets";

export interface TourBusCard {
  id: string;
  detailHref: string;
  name: string;
  days: number;
  size: string;
  price: string;
  priceUnit: string;
  iconKey: "van" | "bus" | "fullbus" | "motorcoach";
  image: ImageMetadata | null;
  gradientStyle: string;
  country: string;
  state: string;
  cities: string[];
  highlights: string[];
  included: string[];
}

// Placeholder until real operator counts come from the backend — deterministic
// per tour bus id so the number stays stable across renders instead of
// flickering between the card grid and the detail page.
export function operatorCount(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash << 5) - hash + id.charCodeAt(i);
    hash |= 0;
  }
  const min = 3;
  const max = 15;
  return min + (Math.abs(hash) % (max - min + 1));
}

export async function loadTourBusCards(): Promise<TourBusCard[]> {
  const entries = await getCollection("tourBus");
  assertNoReservedSlugConflicts(entries.map((e) => e.id));
  return entries.map((entry) => ({
    id: entry.id,
    detailHref: `/tour-bus/${entry.id}`,
    name: entry.data.name,
    days: entry.data.days,
    size: entry.data.size,
    price: entry.data.price,
    priceUnit: entry.data.priceUnit,
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
