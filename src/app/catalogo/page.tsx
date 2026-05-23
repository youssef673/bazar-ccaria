import { Suspense } from "react";
import { getCategories } from "@/lib/products";
import { CatalogFilters } from "@/components/catalog/catalog-filters";
import { CatalogProducts } from "@/components/catalog/catalog-products";
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

  const query = new URLSearchParams();
  if (params.categoria) query.set("categoria", params.categoria);
  if (params.q) query.set("q", params.q);
  if (params.stato) query.set("stato", params.stato);
  if (params.materiale) query.set("materiale", params.materiale);
  if (params.min) query.set("min", params.min);
  if (params.max) query.set("max", params.max);
  if (params.pesante) query.set("pesante", params.pesante);
  if (params.disponibile) query.set("disponibile", params.disponibile);
  if (params.ordinamento) query.set("ordinamento", params.ordinamento);

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
          <CatalogProducts queryString={query.toString()} />
        </div>
      </div>
    </div>
  );
}
