import { Camera, CreditCard, MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { TRUST_SIGNALS } from "@/lib/constants";

const icons = [Camera, Truck, MessageCircle, CreditCard];

export function TrustPanel({ compact = false }: { compact?: boolean }) {
  return (
    <section
      className={
        compact
          ? "grid gap-3 sm:grid-cols-2"
          : "grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      }
      aria-label="Garanzie e servizi"
    >
      {TRUST_SIGNALS.map((signal, index) => {
        const Icon = icons[index] || ShieldCheck;
        return (
          <div
            key={signal.title}
            className="rounded-lg border border-stone-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-sage/10 text-sage-dark">
              <Icon className="h-5 w-5" />
            </div>
            <h3 className="text-sm font-semibold text-charcoal">
              {signal.title}
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-stone-600">
              {signal.text}
            </p>
          </div>
        );
      })}
    </section>
  );
}
