"use client";

import Link from "next/link";
import { ShoppingBag, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { formatPrice } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

export function AccountCartSummary() {
  const mounted = useMounted();
  const { items, totalItems, subtotal, totalWeight, hasHeavyItems } = useCart();
  const itemCount = mounted ? totalItems() : 0;
  const total = mounted ? subtotal() : 0;
  const weight = mounted ? totalWeight() : 0;
  const visibleItems = mounted ? items : [];

  return (
    <section className="rounded-lg border border-stone-200 bg-white p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl text-charcoal">Carrello</h2>
          <p className="mt-1 text-sm text-stone-600">
            {itemCount === 0
              ? "Nessun prodotto nel carrello"
              : `${itemCount} ${itemCount === 1 ? "articolo" : "articoli"} pronti`}
          </p>
        </div>
        <ShoppingBag className="h-6 w-6 text-terracotta" />
      </div>

      {visibleItems.length > 0 && (
        <div className="mt-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Subtotale</span>
            <span className="font-medium text-charcoal">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-stone-600">Peso stimato</span>
            <span className="font-medium text-charcoal">{weight.toFixed(1)} kg</span>
          </div>
          {mounted && hasHeavyItems() && (
            <p className="flex gap-2 rounded-md bg-amber-50 p-3 text-xs text-amber-800">
              <Truck className="mt-0.5 h-4 w-4 shrink-0" />
              Alcuni articoli richiedono un preventivo di consegna.
            </p>
          )}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Button asChild>
          <Link href={visibleItems.length > 0 ? "/carrello" : "/catalogo"}>
            {visibleItems.length > 0 ? "Apri carrello" : "Sfoglia catalogo"}
          </Link>
        </Button>
        {visibleItems.length > 0 && (
          <Button asChild variant="outline">
            <Link href="/checkout">Checkout</Link>
          </Button>
        )}
      </div>
    </section>
  );
}
