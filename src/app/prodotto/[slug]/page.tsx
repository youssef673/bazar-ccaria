import { notFound } from "next/navigation";
import Link from "next/link";
import { Camera, Ruler, ShieldCheck, Truck } from "lucide-react";
import { getProductBySlug } from "@/lib/products";
import { ProductGallery } from "@/components/products/product-gallery";
import { AddToCart } from "@/components/products/add-to-cart";
import { ProductReviews } from "@/components/products/product-reviews";
import { TrustPanel } from "@/components/commerce/trust-panel";
import { formatPrice } from "@/lib/utils";
import {
  DELIVERY_ESTIMATE_BY_PROVINCE,
  PRODUCT_CARE_NOTES,
  PRODUCT_STATUS_LABELS,
  PRODUCT_STATUS_COLORS,
} from "@/lib/constants";

export const dynamic = 'force-dynamic';
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
  const approvedReviews = product.reviews;
  const averageRating =
    approvedReviews.length > 0
      ? approvedReviews.reduce((sum, review) => sum + review.rating, 0) /
        approvedReviews.length
      : null;
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
    ...(averageRating && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: averageRating.toFixed(1),
        reviewCount: approvedReviews.length,
      },
    }),
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

          <dl className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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
            <dt className="text-stone-500">Disponibilita</dt>
            <dd className="font-medium">
              {product.stock > 0
                ? `${product.stock} pezzi disponibili`
                : product.allowPreorder
                  ? "Ordinabile"
                  : PRODUCT_STATUS_LABELS[product.status]}
            </dd>
          </dl>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <InfoCard
              icon={<Camera className="h-5 w-5" />}
              title="Foto aggiuntive"
              text="Chiedi dettagli, video o foto del pezzo reale prima di confermare."
            />
            <InfoCard
              icon={<Truck className="h-5 w-5" />}
              title={product.isHeavy ? "Consegna su preventivo" : "Consegna stimabile"}
              text={
                product.isHeavy
                  ? "Peso importante: calcoliamo accesso, scarico e distanza."
                  : "Costo e tempi vengono stimati nel checkout in base alla provincia."
              }
            />
            <InfoCard
              icon={<Ruler className="h-5 w-5" />}
              title="Misure verificate"
              text="Controlla ingombro, peso e spazio di posa prima dell'acquisto."
            />
            <InfoCard
              icon={<ShieldCheck className="h-5 w-5" />}
              title="Pagamenti flessibili"
              text="Per su ordinazione puoi usare caparra e saldo alla consegna."
            />
          </div>

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

      <section className="mt-12 grid gap-8 lg:grid-cols-2">
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
          <h2 className="font-display text-2xl text-charcoal">
            Cura e manutenzione
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-stone-600">
            {PRODUCT_CARE_NOTES.map((note) => (
              <li key={note} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-terracotta" />
                <span>{note}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-stone-200 bg-stone-50 p-6">
          <h2 className="font-display text-2xl text-charcoal">
            Tempi indicativi in Calabria
          </h2>
          <div className="mt-4 grid gap-2 text-sm text-stone-600 sm:grid-cols-2">
            {Object.entries(DELIVERY_ESTIMATE_BY_PROVINCE).map(
              ([province, estimate]) => (
                <p key={province} className="flex justify-between gap-3">
                  <span>{province}</span>
                  <span className="font-medium text-charcoal">{estimate}</span>
                </p>
              )
            )}
          </div>
        </div>
      </section>

      <div className="mt-12">
        <TrustPanel compact />
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

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-lg border border-stone-200 bg-stone-50 p-4">
      <div className="mb-2 flex items-center gap-2 text-terracotta">
        {icon}
        <h2 className="text-sm font-semibold text-charcoal">{title}</h2>
      </div>
      <p className="text-sm leading-relaxed text-stone-600">{text}</p>
    </div>
  );
}
