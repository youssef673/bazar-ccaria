"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, Package } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

export default function CarrelloPage() {
  const mounted = useMounted();
  const {
    items,
    updateQuantity,
    removeItem,
    subtotal,
    totalWeight,
    hasHeavyItems,
    totalItems,
  } = useCart();

  if (!mounted) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 h-10 w-48 rounded-md bg-stone-100" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-4">
            {[0, 1].map((item) => (
              <div
                key={item}
                className="h-32 rounded-xl border border-stone-200 bg-white"
              />
            ))}
          </div>
          <div className="h-64 rounded-xl border border-stone-200 bg-stone-50" />
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="font-display text-4xl text-charcoal mb-4">Il tuo carrello è vuoto</h1>
        <p className="text-stone-600 mb-8">Aggiungi prodotti dal catalogo</p>
        <Button asChild>
          <Link href="/catalogo">Vai al catalogo</Link>
        </Button>
      </div>
    );
  }

  const total = subtotal();
  const weight = totalWeight();
  const heavy = hasHeavyItems();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-2">Carrello</h1>
      <p className="text-stone-600 mb-8">
        {totalItems()} {totalItems() === 1 ? "articolo" : "articoli"}
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="flex gap-4 p-4 bg-white border border-stone-200 rounded-xl"
            >
              <Link
                href={`/prodotto/${item.slug}`}
                className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-stone-100"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full"><Package className="h-8 w-8 text-stone-400" /></div>
                )}
              </Link>

              <div className="flex-1 min-w-0">
                <Link
                  href={`/prodotto/${item.slug}`}
                  className="font-medium text-charcoal hover:text-terracotta line-clamp-2"
                >
                  {item.name}
                </Link>
                <p className="text-terracotta font-semibold mt-1">
                  {formatPrice(item.price)}
                </p>
                {item.isHeavy && (
                  <p className="text-xs text-amber-700 mt-1">Prodotto pesante</p>
                )}
              </div>

              <div className="flex flex-col items-end justify-between">
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-stone-400 hover:text-red-600 transition-colors"
                  aria-label={`Rimuovi ${item.name} dal carrello`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center border border-stone-300 rounded-md">
                  <button
                    type="button"
                    className="p-2 hover:bg-stone-100"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    aria-label={`Diminuisci quantità di ${item.name}`}
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span
                    className="px-3 py-1 min-w-[2rem] text-center text-sm"
                    aria-live="polite"
                  >
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    className="p-2 hover:bg-stone-100"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    aria-label={`Aumenta quantità di ${item.name}`}
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <p className="text-sm font-medium text-charcoal mt-2">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <aside className="lg:col-span-1">
          <div className="sticky top-24 p-6 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
            <h2 className="font-display text-2xl text-charcoal">Riepilogo</h2>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-stone-600">Articoli</span><span>{totalItems()}</span></div>
              <div className="flex justify-between">
                <span className="text-stone-600">Peso totale</span>
                <span>{weight.toFixed(1)} kg</span>
              </div>
              {heavy && (
                <p className="text-xs text-amber-800 bg-amber-50 p-2 rounded-lg">
                  Prodotti pesanti: la spedizione richiederà un preventivo al checkout.
                </p>
              )}
            </div>

            <div className="border-t border-stone-200 pt-4 flex justify-between items-center">
              <span className="font-medium">Subtotale</span>
              <span className="font-display text-2xl text-terracotta">{formatPrice(total)}</span>
            </div>

            <p className="text-xs text-stone-500">
              Spese di consegna calcolate al checkout in base alla zona e al metodo scelto.
            </p>

            <Button asChild size="lg" className="w-full">
              <Link href="/checkout">
                Procedi al checkout
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>

            <Button asChild variant="outline" className="w-full">
              <Link href="/catalogo">Continua gli acquisti</Link>
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}

