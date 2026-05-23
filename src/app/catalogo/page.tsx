import { Suspense } from "react";
import { getProducts, getCategories } from "@/lib/products";
import { ProductCard } from "@/components/products/product-card";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CATEGORIES } from "@/lib/constants";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

interface PageProps {
  searchParams: Promise<{
    categoria?: string;
    q?: string;
    stato?: string;
    ordinamento?: string;
    materiale?: string;
    min?: string;
    max?: string;
    pesante?: string;
    disponibile?: string;
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
    minPrice: params.min ? Number(params.min) : undefined,
    maxPrice: params.max ? Number(params.max) : undefined,
    isHeavy: params.pesante === "1" ? true : params.pesante === "0" ? false : undefined,
    inStock: params.disponibile === "1",
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
        <div className="mt-5 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
          <p className="rounded-lg border border-stone-200 bg-white p-3">
            Filtra per prezzo, materiale e disponibilita reale.
          </p>
          <p className="rounded-lg border border-stone-200 bg-white p-3">
            I prodotti oltre 30 kg passano da preventivo dedicato.
          </p>
          <p className="rounded-lg border border-stone-200 bg-white p-3">
            Puoi chiedere foto aggiuntive via WhatsApp prima dell&apos;acquisto.
          </p>
        </div>
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
                    material: product.material,
                    dimensions: product.dimensions,
                    weight: product.weight ? Number(product.weight) : null,
                    isHeavy: product.isHeavy,
                    productionDays: product.productionDays,
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
