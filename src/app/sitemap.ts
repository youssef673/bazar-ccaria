import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/constants";

const staticRoutes = [
  "",
  "/catalogo",
  "/galleria",
  "/consegne",
  "/preventivi",
  "/contatti",
  "/account",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteUrl}${route}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.7,
    })),
    ...CATEGORIES.map((category) => ({
      url: `${siteUrl}/catalogo/${category.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    })),
  ];
}
