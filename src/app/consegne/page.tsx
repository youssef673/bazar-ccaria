import Link from "next/link";
import { Truck, Package, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getServedZones } from "@/lib/calabria";
import { DELIVERY_METHOD_LABELS } from "@/lib/constants";

export const metadata = {
  title: "Consegne",
  description: "Zone servite e modalità di consegna in Calabria",
};

export default function ConsegnePage() {
  const zones = getServedZones();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-4">Consegne</h1>
      <p className="text-stone-600 max-w-3xl mb-12">
        Consegniamo esclusivamente in Calabria. Scegli tra consegna locale, corriere o ritiro in sede.
        Per prodotti pesanti oltre 30 kg, prepariamo un preventivo dedicato.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        {Object.entries(DELIVERY_METHOD_LABELS).map(([key, label]) => (
          <div key={key} className="p-6 bg-stone-50 rounded-xl border border-stone-200">
            {key === "LOCAL_DELIVERY" && <Truck className="h-8 w-8 text-terracotta mb-4" />}
            {key === "COURIER" && <Package className="h-8 w-8 text-terracotta mb-4" />}
            {key === "PICKUP" && <MapPin className="h-8 w-8 text-terracotta mb-4" />}
            <h2 className="font-display text-xl text-charcoal">{label}</h2>
            <p className="text-sm text-stone-600 mt-2">
              {key === "PICKUP"
                ? "Ritiro gratuito presso la nostra sede."
                : "Costi calcolati in base al peso e alla distanza."}
            </p>
          </div>
        ))}
      </div>

      <h2 className="font-display text-3xl text-charcoal mb-6">Zone servite</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(zones).map(([province, cities]) => (
          <div key={province} className="p-4 bg-white border border-stone-200 rounded-lg">
            <h3 className="font-medium text-charcoal">{province}</h3>
            <ul className="mt-2 text-sm text-stone-600 space-y-1">
              {cities.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <Button asChild className="mt-10">
        <Link href="/preventivi">Richiedi preventivo spedizione</Link>
      </Button>
    </div>
  );
}
