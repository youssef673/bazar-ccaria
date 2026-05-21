import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/products/product-card";
import { TrustPanel } from "@/components/commerce/trust-panel";
import { Button } from "@/components/ui/button";
import { CATEGORIES, LOCAL_SEO_PROVINCES } from "@/lib/constants";
import { getCategories, getProducts } from "@/lib/products";

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getCategory(slug: string) {
  const dbCategories = await getCategories();
  return (
    dbCategories.find((category) => category.slug === slug) ||
    CATEGORIES.find((category) => category.slug === slug)
  );
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) {
    return { title: "Categoria non trovata" };
  }

  return {
    title: `${category.name} in Calabria`,
    description: `${category.description}. Scopri ${category.name.toLowerCase()} artigianali con consegna in Calabria e preventivi per prodotti pesanti.`,
    alternates: { canonical: `/catalogo/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);

  if (!category) notFound();

  const products = await getProducts({ category: slug, sort: "newest" });

  return (
    <div className="container mx-auto px-4 py-12">
      <nav className="mb-8 text-sm text-stone-500" aria-label="Breadcrumb">
        <Link href="/catalogo" className="hover:text-terracotta">
          Catalogo
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{category.name}</span>
      </nav>

      <div className="mb-10 max-w-3xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-terracotta">
          Categoria Calabria
        </p>
        <h1 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
          {category.name}
        </h1>
        <p className="mt-4 text-stone-600">
          {category.description}. Selezioniamo pezzi per giardini, terrazzi e
          ingressi in Calabria, con consegna locale e preventivo dedicato per
          prodotti pesanti.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href={`/catalogo?categoria=${category.slug}`}>
              Filtra nel catalogo
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/preventivi">Richiedi preventivo</Link>
          </Button>
        </div>
      </div>

      {products.length > 0 && (
        <section className="mb-16">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-3xl text-charcoal">
                Prodotti disponibili
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                {products.length} proposte in questa categoria.
              </p>
            </div>
            <Button asChild variant="outline">
              <Link href={`/catalogo?categoria=${category.slug}`}>
                Vedi tutti
              </Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.slice(0, 6).map((product) => (
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
        </section>
      )}

      <section className="mb-16 rounded-lg border border-stone-200 bg-stone-50 p-6">
        <h2 className="font-display text-3xl text-charcoal">
          {category.name} con consegna nelle province calabresi
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {LOCAL_SEO_PROVINCES.map((area) => (
            <article key={area.province} className="rounded-lg bg-white p-4">
              <h3 className="font-semibold text-charcoal">
                {category.name} a {area.province}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">
                {area.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <TrustPanel />
    </div>
  );
}
