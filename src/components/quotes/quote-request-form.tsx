"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useCart } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { CALABRIA_PROVINCES, CALABRIA_CITIES } from "@/lib/constants";
import { useMounted } from "@/hooks/use-mounted";

const schema = z.object({
  customerName: z.string().min(2, "Inserisci nome e cognome"),
  customerEmail: z.string().email("Email non valida"),
  customerPhone: z.string().min(8, "Telefono non valido"),
  city: z.string().min(2, "Seleziona la città"),
  province: z.string().min(1, "Seleziona la provincia"),
  cap: z.string().optional(),
  address: z.string().optional(),
  message: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function QuoteRequestForm() {
  const mounted = useMounted();
  const { items, totalWeight } = useCart();
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">("idle");
  const [msg, setMsg] = useState("");

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const province = watch("province");
  const cities = province ? CALABRIA_CITIES[province] ?? [] : [];

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          items: items.map((i) => ({
            productId: i.productId,
            name: i.name,
            quantity: i.quantity,
            price: i.price,
            weight: i.weight,
          })),
          totalWeight: totalWeight(),
        }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus("ok");
        setMsg(`Richiesta inviata! Numero: ${json.quoteNumber}`);
      } else {
        setStatus("error");
        setMsg(json.error || "Non è stato possibile inviare la richiesta.");
      }
    } catch {
      setStatus("error");
      setMsg("Errore di connessione");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-xl space-y-6 p-6 bg-stone-50 rounded-xl border border-stone-200">
      {msg && (
        <p className={`p-3 rounded-lg text-sm ${status === "ok" ? "bg-sage/10 text-sage-dark" : "bg-red-50 text-red-700"}`}>
          {msg}
        </p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="customerName">Nome</Label>
          <Input id="customerName" className="mt-1" {...register("customerName")} />
          {errors.customerName && <p className="text-sm text-red-600 mt-1">{errors.customerName.message}</p>}
        </div>
        <div>
          <Label htmlFor="customerEmail">Email</Label>
          <Input id="customerEmail" type="email" className="mt-1" {...register("customerEmail")} />
          {errors.customerEmail && <p className="text-sm text-red-600 mt-1">{errors.customerEmail.message}</p>}
        </div>
        <div>
          <Label htmlFor="customerPhone">Telefono</Label>
          <Input id="customerPhone" className="mt-1" {...register("customerPhone")} />
          {errors.customerPhone && <p className="text-sm text-red-600 mt-1">{errors.customerPhone.message}</p>}
        </div>
        <div>
          <Label htmlFor="province">Provincia</Label>
          <Select id="province" className="mt-1" {...register("province")}>
            <option value="">Seleziona</option>
            {CALABRIA_PROVINCES.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          {errors.province && <p className="text-sm text-red-600 mt-1">{errors.province.message}</p>}
        </div>
        <div>
          <Label htmlFor="city">Città</Label>
          <Select id="city" className="mt-1" {...register("city")} disabled={!province}>
            <option value="">Seleziona</option>
            {cities.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </Select>
          {errors.city && <p className="text-sm text-red-600 mt-1">{errors.city.message}</p>}
        </div>
        <div>
          <Label htmlFor="cap">CAP</Label>
          <Input id="cap" className="mt-1" {...register("cap")} />
        </div>
      </div>
      <div>
        <Label htmlFor="address">Indirizzo</Label>
        <Input id="address" className="mt-1" {...register("address")} />
      </div>
      <div>
        <Label htmlFor="message">Messaggio</Label>
        <Textarea id="message" rows={4} className="mt-1" {...register("message")} />
      </div>
      {mounted && items.length > 0 && (
        <p className="text-sm text-stone-600">
          Inclusi {items.length} prodotti dal carrello (peso: {totalWeight().toFixed(1)} kg)
        </p>
      )}
      <Button type="submit" disabled={status === "loading"}>
        {status === "loading" ? "Invio..." : "Invia richiesta"}
      </Button>
    </form>
  );
}
