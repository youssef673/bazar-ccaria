import Link from "next/link";
import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <SearchX className="mb-6 h-14 w-14 text-terracotta" />
      <h1 className="font-display text-4xl text-charcoal">
        Pagina non trovata
      </h1>
      <p className="mt-4 text-stone-600">
        Il contenuto che cerchi potrebbe essere stato spostato o non essere più
        disponibile.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link href="/catalogo">Vai al catalogo</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Torna alla home</Link>
        </Button>
      </div>
    </div>
  );
}
