"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto flex min-h-[55vh] max-w-xl flex-col items-center justify-center px-4 py-20 text-center">
      <AlertTriangle className="mb-6 h-14 w-14 text-terracotta" />
      <h1 className="font-display text-4xl text-charcoal">
        Qualcosa non ha funzionato
      </h1>
      <p className="mt-4 text-stone-600">
        Riprova tra poco. Se il problema resta, contattaci indicando la pagina
        che stavi visitando.
      </p>
      <Button type="button" className="mt-8" onClick={reset}>
        Riprova
      </Button>
    </div>
  );
}
