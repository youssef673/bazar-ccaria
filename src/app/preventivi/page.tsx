import { QuoteRequestForm } from "@/components/quotes/quote-request-form";

export const metadata = {
  title: "Preventivi",
  description: "Richiedi un preventivo per spedizioni pesanti o ordini speciali",
};

export default function PreventiviPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-4">Richiedi preventivo</h1>
      <p className="text-stone-600 max-w-2xl mb-10">
        Per prodotti pesanti, consegne fuori zona o ordini personalizzati, compila il modulo.
        Ti risponderemo entro 48 ore lavorative.
      </p>
      <QuoteRequestForm />
    </div>
  );
}
