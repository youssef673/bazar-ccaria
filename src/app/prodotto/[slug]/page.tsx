import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/products";
import { ProductGallery } from "@/components/products/product-gallery";
import { AddToCart } from "@/components/products/add-to-cart";
import { ProductReviews } from "@/components/products/product-reviews";
import { formatPrice } from "@/lib/utils";
import {
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_COLORS,
} from "@/lib/constants";
import type { Metadata } from "next";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Prodotto non trovato" };
  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || undefined,
    openGraph: {
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const price = Number(product.price);
  const compareAt = product.compareAtPrice ? Number(product.compareAtPrice) : null;
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images.map((image) => image.url),
    category: product.category.name,
    sku: product.id,
    offers: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price,
      availability:
        product.status === "OUT_OF_STOCK"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
      url: `/prodotto/${product.slug}`,
    },
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <nav className="mb-8 text-sm text-stone-500" aria-label="Breadcrumb">
        <Link href="/catalogo" className="hover:text-terracotta">
          Catalogo
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/catalogo?categoria=${product.category.slug}`}
          className="hover:text-terracotta"
        >
          {product.category.name}
        </Link>
        <span className="mx-2">/</span>
        <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={product.images} name={product.name} />

        <div>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-4 ${PRODUCT_STATUS_COLORS[product.status]}`}
          >
            {PRODUCT_STATUS_LABELS[product.status]}
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal">
            {product.name}
          </h1>
          <div className="mt-4 flex flex-wrap items-baseline gap-3">
            <span className="text-3xl font-semibold">{formatPrice(price)}</span>
            {compareAt && compareAt > price && (
              <span className="text-xl text-stone-400 line-through">
                {formatPrice(compareAt)}
              </span>
            )}
          </div>

          {product.shortDescription && (
            <p className="mt-6 text-stone-600 leading-relaxed">
              {product.shortDescription}
            </p>
          )}

          <dl className="mt-8 grid grid-cols-2 gap-4 text-sm">
            {product.material && (
              <>
                <dt className="text-stone-500">Materiale</dt>
                <dd className="font-medium">{product.material}</dd>
              </>
            )}
            {product.dimensions && (
              <>
                <dt className="text-stone-500">Dimensioni</dt>
                <dd className="font-medium">{product.dimensions}</dd>
              </>
            )}
            {product.weight && (
              <>
                <dt className="text-stone-500">Peso</dt>
                <dd className="font-medium">
                  {Number(product.weight)} {product.weightUnit}
                </dd>
              </>
            )}
            {product.productionDays && (
              <>
                <dt className="text-stone-500">Tempi produzione</dt>
                <dd className="font-medium">{product.productionDays} giorni</dd>
              </>
            )}
          </dl>

          <div className="mt-10 pt-8 border-t border-stone-200">
            <AddToCart
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                price,
                status: product.status,
                images: product.images,
                weight: product.weight ? Number(product.weight) : null,
                isHeavy: product.isHeavy,
                allowPreorder: product.allowPreorder,
                preorderDepositPct: product.preorderDepositPct,
              }}
            />
          </div>
        </div>
      </div>

      <div className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl text-charcoal mb-4">Descrizione</h2>
        <p className="text-stone-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>

      <ProductReviews
        productId={product.id}
        reviews={product.reviews.map((r) => ({
          ...r,
          images: r.images,
        }))}
      />
    </div>
  );
}
