import type { MetadataRoute } from "next";
import { CATEGORIES } from "@/lib/constants";
import { prisma } from "@/lib/prisma";

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

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await prisma.product.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
      take: 500,
    });
    productRoutes = products.map((product) => ({
      url: `${siteUrl}/prodotto/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch {
    productRoutes = [];
  }

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
    ...productRoutes,
  ];
}
