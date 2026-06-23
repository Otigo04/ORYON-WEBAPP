import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";
import { branches } from "@/lib/branches";

/**
 * sitemap.xml (Next.js Metadata-Route).
 * Listet alle indexierbaren öffentlichen Routen inkl. der Branchenseiten.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: `${siteConfig.url}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...branches.map((b) => ({
      url: `${siteConfig.url}/branchen/${b.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    {
      url: `${siteConfig.url}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${siteConfig.url}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];
}
