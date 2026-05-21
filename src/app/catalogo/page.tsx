import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CATEGORIES } from "@/lib/constants";

interface PageProps {
  searchParams: Promise<{
    categoria?: string;
    q?: string;
    stato?: string;
    ordinamento?: string;
    materiale?: string;
  }>;
}

export const metadata = {
  title: "Catalogo",
  description:
    "Sfoglia vasi in ceramica, statue in cemento, fontane e arredo giardino. Artigianato calabrese.",
};

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const products = await getProducts({
    category: params.categoria,
    search: params.q,
    status: params.stato as "AVAILABLE" | "PREORDER" | "ON_ORDER" | "OUT_OF_STOCK" | undefined,
    material: params.materiale,
    sort: (params.ordinamento as "price-asc" | "price-desc" | "newest" | "name") || "newest",
  });

  let categories = await getCategories();
  if (categories.length === 0) {
    categories = CATEGORIES.map((c, i) => ({
      id: c.slug,
      name: c.name,
      slug: c.slug,
      description: c.description,
      image: null,
      sortOrder: i,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10">
        <h1 className="font-display text-4xl md:text-5xl text-charcoal">Catalogo</h1>
        <p className="mt-2 text-stone-600">
          {products.length} prodotti
          {params.categoria &&
            ` in ${categories.find((c) => c.slug === params.categoria)?.name}`}
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <aside className="lg:w-64 shrink-0">
          <Suspense
            fallback={<div className="h-64 bg-stone-100 rounded-lg animate-pulse" />}
          >
            <CatalogFilters categories={categories} />
          </Suspense>
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-stone-50 rounded-xl">
              <p className="text-stone-600">Nessun prodotto trovato.</p>
              <p className="text-sm text-stone-500 mt-2">
                Prova a modificare i filtri o esegui il seed del database.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    compareAtPrice: product.compareAtPrice
                      ? Number(product.compareAtPrice)
                      : null,
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
