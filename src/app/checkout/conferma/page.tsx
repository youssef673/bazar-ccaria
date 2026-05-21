import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Ordine confermato",
};

export default async function ConfermaPage({
  searchParams,
}: {
  searchParams: Promise<{ ordine?: string }>;
}) {
  const { ordine } = await searchParams;

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <CheckCircle className="h-16 w-16 text-sage mx-auto mb-6" />
      <h1 className="font-display text-4xl text-charcoal mb-4">Grazie per il tuo ordine!</h1>
      {ordine && (
        <p className="text-stone-600 mb-2">
          Numero ordine: <strong className="text-charcoal">{ordine}</strong>
        </p>
      )}
      <p className="text-stone-600 mb-8">
        Ti abbiamo inviato una email di conferma. Per bonifico o caparra, segui le istruzioni ricevute.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button asChild>
          <Link href="/catalogo">Continua lo shopping</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/contatti">Contattaci</Link>
        </Button>
      </div>
    </div>
  );
}
