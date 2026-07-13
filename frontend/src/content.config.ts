import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const tourBus = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/tour-bus" }),
  schema: ({ image }) =>
    z.object({
      // Card / listing info (used on /tour-bus)
      name: z.string(),
      tourBusLabel: z.string(),
      tagline: z.string(),
      days: z.number(),
      size: z.string(),
      vehicle: z.string(),
      price: z.string(),
      priceUnit: z.string(),
      country: z.string(),
      state: z.string(),
      cities: z.array(z.string()),
      iconKey: z.enum(["van", "bus", "fullbus", "motorcoach"]),
      cardGradient: z.string(),
      cardImage: image().optional(),
      cardHighlights: z.array(z.string()),
      included: z.array(z.string()),

      // SEO
      seoTitle: z.string(),
      seoDescription: z.string(),

      // Hero
      heroImage: image().optional(),
      heroImageAlt: z.string(),
      heroHeadingLine1: z.string(),
      heroHeadingLine2: z.string(),
      heroDescription: z.string(),

      // Overview section copy
      overviewHeading: z.string(),
      overviewParagraphs: z.array(z.string()),

      // Route-specific content (Why Choose Us, Perfect for Every Group, Our
      // Fleet, Premium Amenities, and Related Tours are all company-wide
      // content and are NOT stored per-entry — see src/components/tour-bus/
      // for those, and RelatedTours is now computed live from this collection
      // instead of hand-typed per entry.)
      tourHighlights: z.array(z.string()),
      // Extra experiences near the route, distinct from tourHighlights (the
      // confirmed stops already on the itinerary) — shown in the Why Groups
      // Love It / "Things to Do" section.
      thingsToDo: z.array(z.object({ title: z.string(), desc: z.string() })),
      itinerary: z.array(
        z.object({ day: z.string(), title: z.string(), desc: z.string() })
      ),
      faqs: z.array(z.object({ q: z.string(), a: z.string() })),
      testimonials: z.array(
        z.object({
          quote: z.string(),
          name: z.string(),
          role: z.string(),
          company: z.string(),
          flag: z.string(),
        })
      ),
    }),
});

export const collections = { tourBus };
