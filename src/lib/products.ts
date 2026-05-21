import { prisma } from "./prisma";
import type { ProductStatus } from "@prisma/client";

export interface ProductFilters {
  category?: string;
  status?: ProductStatus;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  material?: string;
  sort?: "price-asc" | "price-desc" | "newest" | "name";
}

export async function getProducts(filters: ProductFilters = {}) {
  const where: Record<string, unknown> = {};

  if (filters.category) {
    where.category = { slug: filters.category };
  }
  if (filters.status) {
    where.status = filters.status;
  }
  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { material: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {};
    if (filters.minPrice !== undefined) {
      (where.price as Record<string, number>).gte = filters.minPrice;
    }
    if (filters.maxPrice !== undefined) {
      (where.price as Record<string, number>).lte = filters.maxPrice;
    }
  }
  if (filters.material) {
    where.material = { contains: filters.material, mode: "insensitive" };
  }

  const orderBy =
    filters.sort === "price-asc"
      ? { price: "asc" as const }
      : filters.sort === "price-desc"
        ? { price: "desc" as const }
        : filters.sort === "name"
          ? { name: "asc" as const }
          : { createdAt: "desc" as const };

  return prisma.product.findMany({
    where,
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: { select: { name: true, slug: true } },
    },
    orderBy,
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { sortOrder: "asc" } },
      category: true,
      reviews: {
        where: { approved: true },
        include: { images: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
}

export async function getCategories() {
  return prisma.category.findMany({ orderBy: { sortOrder: "asc" } });
}
