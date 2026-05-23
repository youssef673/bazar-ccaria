"use client";

import { useEffect, useState } from "react";
import { ProductCard } from "@/components/products/product-card";
import type { getProducts } from "@/lib/products";

type Product = Awaited<ReturnType<typeof getProducts>>[number];

interface Props {
  queryString: string;
}

export function CatalogProducts({ queryString }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/products?${queryString}`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProducts(data.products ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [queryString]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-80 bg-stone-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-20 bg-stone-50 rounded-xl">
        <p className="text-stone-600">Nessun prodotto trovato.</p>
        <p className="text-sm text-stone-500 mt-2">
          Prova a modificare i filtri o esegui il seed del database.
        </p>
      </div>
    );
  }

  return (
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
  );
}
