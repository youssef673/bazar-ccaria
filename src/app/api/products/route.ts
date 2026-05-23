import { NextResponse } from "next/server";
import { getProducts, getCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    const [products, categories] = await Promise.all([
      getProducts({
        category: searchParams.get("categoria") ?? undefined,
        search: searchParams.get("q") ?? undefined,
        status: searchParams.get("stato") as "AVAILABLE" | "PREORDER" | "ON_ORDER" | "OUT_OF_STOCK" | undefined,
        material: searchParams.get("materiale") ?? undefined,
        minPrice: searchParams.has("min") ? Number(searchParams.get("min")) : undefined,
        maxPrice: searchParams.has("max") ? Number(searchParams.get("max")) : undefined,
        isHeavy: searchParams.get("pesante") === "1" ? true : searchParams.get("pesante") === "0" ? false : undefined,
        inStock: searchParams.get("disponibile") === "1",
        sort: (searchParams.get("ordinamento") as "price-asc" | "price-desc" | "newest" | "name") || "newest",
      }),
      getCategories(),
    ]);

    return NextResponse.json({ products, categories });
  } catch (e) {
    return NextResponse.json(
      { products: [], categories: [], error: String(e) },
      { status: 500 }
    );
  }
}
