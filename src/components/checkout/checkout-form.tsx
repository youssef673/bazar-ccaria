"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle, CreditCard, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import {
  CALABRIA_PROVINCES,
  CALABRIA_CITIES,
  DELIVERY_ESTIMATE_BY_PROVINCE,
  DELIVERY_METHOD_LABELS,
  PAYMENT_METHOD_LABELS,
} from "@/lib/constants";
import { validateCalabriaDelivery } from "@/lib/calabria";
import { estimateShippingCost } from "@/lib/shipping";
import { formatPrice } from "@/lib/utils";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useMounted } from "@/hooks/use-mounted";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Inserisci il nome"),
  customerEmail: z.string().email("Email non valida"),
  customerPhone: z.string().min(8, "Telefono non valido"),
  shippingAddress: z.string().optional(),
  shippingCity: z.string().optional(),
  shippingProvince: z.string().optional(),
  shippingCap: z.string().regex(/^\d{5}$/, "CAP non valido").optional().or(z.literal("")),
  shippingNotes: z.string().optional(),
  deliveryMethod: z.enum(["LOCAL_DELIVERY", "COURIER", "PICKUP"]),
  paymentMethod: z.enum([
    "STRIPE_CARD",
    "PAYPAL",
    "BANK_TRANSFER",
    "CASH_ON_DELIVERY",
    "DEPOSIT",
  ]),
}).superRefine((data, ctx) => {
  if (data.deliveryMethod !== "PICKUP") {
    if (!data.shippingProvince) {
      ctx.addIssue({ code: "custom", message: "Seleziona la provincia", path: ["shippingProvince"] });
    }
    if (!data.shippingCity || data.shippingCity.length < 2) {
      ctx.addIssue({ code: "custom", message: "Inserisci la città", path: ["shippingCity"] });
    }
  }
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CheckoutFieldsData = CheckoutFormData;

export function CheckoutForm() {
  const router = useRouter();
  const mounted = useMounted();
  const { items, subtotal, totalWeight, hasHeavyItems, hasPreorderItems, clearCart } =
    useCart();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      deliveryMethod: "LOCAL_DELIVERY",
      paymentMethod: "STRIPE_CARD",
    },
  });

  const province = watch("shippingProvince");
  const city = watch("shippingCity");
  const deliveryMethod = watch("deliveryMethod");
  const paymentMethod = watch("paymentMethod");

  const cities = province ? CALABRIA_CITIES[province] ?? [] : [];

  const calabriaCheck = useMemo(() => {
    if (!city || !province) return null;
    if (deliveryMethod === "PICKUP") return { valid: true };
    return validateCalabriaDelivery(city, province);
  }, [city, province, deliveryMethod]);

  const shipping = useMemo(() => {
    if (deliveryMethod === "PICKUP") {
      return estimateShippingCost({
        totalWeightKg: totalWeight(),
        city: city || "",
        province: province || "",
        deliveryMethod: "PICKUP",
        hasHeavyItems: hasHeavyItems(),
      });
    }
    if (!city || !province) return null;
    return estimateShippingCost({
      totalWeightKg: totalWeight(),
      city,
      province,
      deliveryMethod,
      hasHeavyItems: hasHeavyItems(),
    });
  }, [city, province, deliveryMethod, totalWeight, hasHeavyItems]);

  const sub = subtotal();
  const shippingCost = shipping?.estimated ?? 0;
  const requiresQuote = shipping?.requiresQuote ?? false;
  const total = requiresQuote ? sub : sub + (shippingCost || 0);
  const deliveryEta =
    deliveryMethod === "PICKUP"
      ? "Ritiro da concordare"
      : province
        ? DELIVERY_ESTIMATE_BY_PROVINCE[province] || "3-6 giorni lavorativi"
        : null;
  const whatsappUrl = buildWhatsAppUrl(
    "Ciao! Sto completando un ordine su bazar di Zico e vorrei un aiuto su consegna o pagamento."
  );

  const depositPct = 30;
  const depositAmount =
    paymentMethod === "DEPOSIT" || hasPreorderItems()
      ? Math.round(total * (depositPct / 100) * 100) / 100
      : null;

  useEffect(() => {
    if (mounted && items.length === 0) {
      router.replace("/carrello");
    }
  }, [items.length, mounted, router]);

  const onSubmit = async (data: CheckoutFormData) => {
    setError("");
    if (data.deliveryMethod === "PICKUP") {
      data.shippingCity = data.shippingCity || "Ritiro in sede";
      data.shippingProvince = data.shippingProvince || "Cosenza";
    }
    if (data.deliveryMethod !== "PICKUP") {
      if (!data.shippingCity || !data.shippingProvince) {
        setError("Inserisci città e provincia per la consegna.");
        return;
      }

      const check = validateCalabriaDelivery(
        data.shippingCity,
        data.shippingProvince
      );
      if (!check.valid) {
        setError(check.message || "Zona non servita");
        return;
      }
    }

    if (requiresQuote && data.paymentMethod === "STRIPE_CARD") {
      setError(
        "Per prodotti pesanti non è possibile pagare subito con carta. Scegli un altro metodo o richiedi un preventivo."
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price,
            name: i.name,
            slug: i.slug,
            status: i.status,
            isPreorder: i.status === "PREORDER" || i.allowPreorder,
          })),
          shippingEstimate: shipping?.estimated,
          requiresQuote,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        setError(result.error || "Errore durante l'ordine");
        return;
      }

      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }

      clearCart();
      router.push(`/checkout/conferma?ordine=${result.orderNumber}`);
    } catch {
      setError("Errore di connessione. Riprova.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!mounted || items.length === 0) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <div className="lg:col-span-2 space-y-8">
        {error && (
          <div className="flex gap-2 p-4 bg-red-50 text-red-800 rounded-lg text-sm">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <section className="p-6 bg-white border border-stone-200 rounded-xl space-y-4">
          <h2 className="font-display text-2xl text-charcoal">Dati cliente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Nome e cognome</Label>
              <Input id="customerName" className="mt-1" {...register("customerName")} />
              {errors.customerName && (
                <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="customerEmail">Email</Label>
              <Input id="customerEmail" type="email" className="mt-1" {...register("customerEmail")} />
              {errors.customerEmail && (
                <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="customerPhone">Telefono</Label>
              <Input id="customerPhone" className="mt-1" {...register("customerPhone")} />
              {errors.customerPhone && (
                <p className="text-sm text-red-600 mt-1">{errors.customerPhone.message}</p>
              )}
            </div>
          </div>
        </section>
        <section className="p-6 bg-white border border-stone-200 rounded-xl space-y-4">
          <div className="flex items-start gap-3">
            <Truck className="mt-1 h-5 w-5 text-terracotta" />
            <div>
              <h2 className="font-display text-2xl text-charcoal">Consegna</h2>
              <p className="text-sm text-stone-600">
                Stima costi e tempi prima della conferma. I prodotti pesanti
                passano sempre da preventivo.
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="deliveryMethod">Metodo</Label>
            <Select id="deliveryMethod" className="mt-1" {...register("deliveryMethod")}>
              {Object.entries(DELIVERY_METHOD_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>
          {deliveryMethod !== "PICKUP" && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shippingProvince">Provincia</Label>
                  <Select id="shippingProvince" className="mt-1" {...register("shippingProvince")}>
                    <option value="">Seleziona</option>
                    {CALABRIA_PROVINCES.map((p) => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </Select>
                  {errors.shippingProvince && (
                    <p className="text-sm text-red-600 mt-1">{errors.shippingProvince.message}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="shippingCity">Città</Label>
                  <Select id="shippingCity" className="mt-1" {...register("shippingCity")} disabled={!province}>
                    <option value="">Seleziona</option>
                    {cities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </Select>
                  {errors.shippingCity && (
                    <p className="text-sm text-red-600 mt-1">{errors.shippingCity.message}</p>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="shippingAddress">Indirizzo</Label>
                  <button type="button" onClick={async () => {
                    if (!navigator.geolocation) return alert('Geolocalizzazione non disponibile');
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const lat = pos.coords.latitude.toFixed(5);
                      const lng = pos.coords.longitude.toFixed(5);
                      setValue('shippingAddress', `Posizione rilevata: ${lat},${lng}`);
                      setValue('shippingNotes', `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
                    }, (err) => {
                      alert('Impossibile ottenere posizione: ' + err.message);
                    });
                  }} className="text-sm text-terracotta underline">Usa localizzazione</button>
                </div>
                <Input id="shippingAddress" className="mt-1" {...register("shippingAddress")} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="shippingCap">CAP</Label>
                  <Input id="shippingCap" className="mt-1" {...register("shippingCap")} />
                </div>
                <div>
                  <Label htmlFor="shippingNotes">Note consegna</Label>
                  <Textarea id="shippingNotes" className="mt-1" rows={2} {...register("shippingNotes")} />
                </div>
              </div>
            </>
          )}
          {calabriaCheck && !calabriaCheck.valid && (
            <p className="text-sm text-amber-800 bg-amber-50 p-3 rounded-lg">{calabriaCheck.message}</p>
          )}
          {deliveryEta && (
            <p className="rounded-lg bg-sage/10 p-3 text-sm text-sage-dark">
              Tempo indicativo: {deliveryEta}. Ti contattiamo prima della
              partenza per confermare giorno e fascia oraria.
            </p>
          )}
          <p className="text-xs text-stone-500">
            Solo Calabria. <Link href="/preventivi" className="text-terracotta underline">Preventivo</Link> per eccezioni.
          </p>
        </section>
        <section className="p-6 bg-white border border-stone-200 rounded-xl space-y-4">
          <div className="flex items-start gap-3">
            <CreditCard className="mt-1 h-5 w-5 text-terracotta" />
            <div>
              <h2 className="font-display text-2xl text-charcoal">Pagamento</h2>
              <p className="text-sm text-stone-600">
                Per articoli su ordinazione o spedizioni pesanti puoi usare la
                caparra e saldare dopo conferma.
              </p>
            </div>
          </div>
          <div>
            <Label htmlFor="paymentMethod">Metodo</Label>
            <Select id="paymentMethod" className="mt-1" {...register("paymentMethod")}>
              {Object.entries(PAYMENT_METHOD_LABELS).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </Select>
          </div>
        </section>
        <section className="grid gap-3 rounded-xl border border-stone-200 bg-stone-50 p-6 text-sm text-stone-600 md:grid-cols-3">
          <div className="flex gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-sage-dark" />
            <span>Dati ordine salvati per assistenza e conferma.</span>
          </div>
          <div className="flex gap-2">
            <Truck className="h-5 w-5 shrink-0 text-sage-dark" />
            <span>Scarico e accesso valutati per pezzi pesanti.</span>
          </div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex gap-2 font-medium text-sage-dark hover:text-sage"
          >
            <MessageCircle className="h-5 w-5 shrink-0" />
            Aiuto via WhatsApp
          </a>
        </section>
      </div>
      <aside className="lg:col-span-1">
        <div className="sticky top-24 p-6 bg-stone-50 border border-stone-200 rounded-xl space-y-4">
          <h2 className="font-display text-2xl text-charcoal">Riepilogo</h2>
          <ul className="space-y-2 text-sm max-h-48 overflow-y-auto">
            {items.map((item) => (
              <li key={item.productId} className="flex justify-between gap-2">
                <span className="text-stone-600">
                  {item.name} × {item.quantity}
                </span>
                <span>{formatPrice(item.price * item.quantity)}</span>
              </li>
            ))}
          </ul>
          <p className="text-xs text-stone-500">Peso: {totalWeight().toFixed(1)} kg</p>
          <div />
          <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotale</span>
              <span>{formatPrice(sub)}</span>
            </div>
            {shipping && (
              <div className="flex justify-between">
                <span>Spedizione (stima)</span>
                <span>
                  {requiresQuote ? "Preventivo" : formatPrice(shippingCost)}
                </span>
              </div>
            )}
            {shipping?.note && (
              <p className="text-xs text-stone-500">{shipping.note}</p>
            )}
            {deliveryEta && (
              <p className="text-xs text-stone-500">
                Tempo indicativo: {deliveryEta}
              </p>
            )}
            {depositAmount != null && (
              <div className="flex justify-between text-terracotta-dark">
                <span>Caparra ({depositPct}%)</span>
                <span>{formatPrice(depositAmount)}</span>
              </div>
            )}
            <div className="flex justify-between font-medium text-base pt-2">
              <span>{requiresQuote ? "Totale prodotti" : "Totale"}</span>
              <span className="text-terracotta">{formatPrice(total)}</span>
            </div>
            {requiresQuote && (
              <p className="text-xs text-amber-700">
                Spedizione da confermare con preventivo prima del pagamento.
              </p>
            )}
          </div>
          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Elaborazione...
              </>
            ) : (
              "Conferma ordine"
            )}
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/carrello">Torna al carrello</Link>
          </Button>
        </div>
      </aside>
    </form>
  );
}

