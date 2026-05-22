"use client";

import { useState } from "react";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl, productInquiryMessage } from "@/lib/whatsapp";
import { formatPrice } from "@/lib/utils";

interface AddToCartProps {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    status: string;
    images: { url: string }[];
    weight?: number | null;
    isHeavy?: boolean;
    allowPreorder?: boolean;
    preorderDepositPct?: number | null;
  };
}

export function AddToCart({ product }: AddToCartProps) {
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCart((s) => s.addItem);

  const canAdd =
    product.status === "AVAILABLE" ||
    product.status === "PREORDER" ||
    (product.status === "ON_ORDER" && product.allowPreorder);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
  const whatsappUrl = buildWhatsAppUrl(
    productInquiryMessage(product.name, `${siteUrl}/prodotto/${product.slug}`)
  );

  const handleAdd = () => {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.images[0]?.url || "",
        status: product.status,
        weight: product.weight ? Number(product.weight) : undefined,
        isHeavy: product.isHeavy,
        allowPreorder: product.allowPreorder,
        preorderDepositPct: product.preorderDepositPct ?? undefined,
      },
      qty
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Quantità</label>
        <div className="flex items-center border border-stone-300 rounded-md">
          <button
            type="button"
            className="px-3 py-2 hover:bg-stone-100"
            onClick={() => setQty(Math.max(1, qty - 1))}
          >
            −
          </button>
          <span className="px-4 py-2 min-w-[3rem] text-center">{qty}</span>
          <button
            type="button"
            className="px-3 py-2 hover:bg-stone-100"
            onClick={() => setQty(qty + 1)}
          >
            +
          </button>
        </div>
      </div>

      {(product.status === "PREORDER" || product.allowPreorder) && (
        <p className="text-sm font-semibold text-amber-800 bg-amber-50 p-3 rounded-lg">
          Attenzione: questo articolo è disponibile solo su pre-ordine. Verrai contattato per conferma e il pagamento potrebbe essere una caparra.
        </p>
      )}

      {product.status === "PREORDER" && product.preorderDepositPct && (
        <p className="text-sm text-terracotta-dark bg-terracotta/10 p-3 rounded-lg">
          Preordine: puoi pagare il {product.preorderDepositPct}% ora (
          {formatPrice(product.price * (product.preorderDepositPct / 100) * qty)})
          e il saldo alla consegna.
        </p>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        {canAdd ? (
          <Button onClick={handleAdd} size="lg" className="flex-1">
            <ShoppingBag className="h-5 w-5" />
            {added ? "Aggiunto!" : "Aggiungi al carrello"}
          </Button>
        ) : (
          <Button disabled size="lg" className="flex-1">
            {product.status === "OUT_OF_STOCK" ? "Esaurito" : "Non disponibile"}
          </Button>
        )}
        <Button asChild variant="outline" size="lg">
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}
