import Image from "next/image";
import Link from "next/link";
import { Package, Ruler, Truck } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import {
  PRODUCT_STATUS_COLORS,
  PRODUCT_STATUS_LABELS,
} from "@/lib/constants";

export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number | string;
  compareAtPrice?: number | string | null;
  status: string;
  images: { url: string; alt?: string | null }[];
  category?: { name: string; slug: string };
  shortDescription?: string | null;
  material?: string | null;
  dimensions?: string | null;
  weight?: number | string | null;
  isHeavy?: boolean | null;
  productionDays?: number | null;
}

export function ProductCard({ product }: { product: ProductCardData }) {
  const image = product.images[0];
  const price = Number(product.price);
  const compareAt = product.compareAtPrice
    ? Number(product.compareAtPrice)
    : null;

  return (
    <Link
      href={`/prodotto/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-stone-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg focus-visible:ring-offset-white"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
        {image ? (
          <Image
            src={image.url}
            alt={image.alt || product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <PlaceholderImage />
        )}
        <span
          className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-xs font-medium ${
            PRODUCT_STATUS_COLORS[product.status] || "bg-stone-200 text-stone-700"
          }`}
        >
          {PRODUCT_STATUS_LABELS[product.status] || product.status}
        </span>
      </div>
      <div className="p-4">
        {product.category && (
          <p className="mb-1 text-xs uppercase tracking-wider text-stone-500">
            {product.category.name}
          </p>
        )}
        <h3 className="line-clamp-2 font-display text-lg text-charcoal transition-colors group-hover:text-terracotta">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="mt-1 line-clamp-2 text-sm text-stone-500">
            {product.shortDescription}
          </p>
        )}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-lg font-semibold text-charcoal">
            {formatPrice(price)}
          </span>
          {compareAt && compareAt > price && (
            <span className="text-sm text-stone-400 line-through">
              {formatPrice(compareAt)}
            </span>
          )}
        </div>
        <div className="mt-3 grid gap-1 text-xs text-stone-500">
          {(product.material || product.dimensions) && (
            <span className="inline-flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-terracotta" />
              {product.material || "Artigianale"}
              {product.dimensions ? ` · ${product.dimensions}` : ""}
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Truck className="h-3.5 w-3.5 text-terracotta" />
            {product.isHeavy
              ? "Preventivo consegna dedicato"
              : product.productionDays
                ? `${product.productionDays} giorni produzione`
                : "Consegna stimabile al checkout"}
          </span>
        </div>
      </div>
    </Link>
  );
}

function PlaceholderImage() {
  return (
    <div className="absolute inset-0 flex items-center justify-center text-stone-400">
      <Package className="h-10 w-10" aria-hidden="true" />
    </div>
  );
}
