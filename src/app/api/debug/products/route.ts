import { NextResponse } from "next/server";
import { getProducts, getCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);

    return NextResponse.json({
      productCount: products.length,
      categoryCount: categories.length,
      firstProduct: products[0] ?? null,
      error: null,
    });
  } catch (e) {
    return NextResponse.json({
      productCount: 0,
      categoryCount: 0,
      firstProduct: null,
      error: String(e),
    });
  }
}
