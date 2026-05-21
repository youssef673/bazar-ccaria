"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type GeneratedResult = {
  title: string;
  shortDescription: string;
  description: string;
};

export default function GenerateProductDescriptionPage() {
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState(0);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setResult(null);

    if (!image) {
      setError("Seleziona un'immagine.");
      return;
    }
    if (!price || price <= 0) {
      setError("Inserisci un prezzo valido.");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("price", String(price));

    setLoading(true);
    try {
      const response = await fetch("/api/ai/describe-product", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Errore durante la generazione.");
      }

      setResult({
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-8">Genera descrizione prodotto</h1>
      <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
        <form onSubmit={handleSubmit} className="space-y-6 bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
          <div>
            <Label htmlFor="image">Immagine del prodotto</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={(event) => setImage(event.target.files?.[0] || null)}
            />
          </div>

          <div>
            <Label htmlFor="price">Prezzo (€)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              value={price || ""}
              onChange={(event) => setPrice(Number(event.target.value))}
            />
          </div>

          <div className="space-y-3">
            <p className="text-sm text-stone-600">
              Carica l&apos;immagine del prodotto e inserisci il prezzo. Il sistema genererà titolo e descrizione in italiano.
            </p>
            <Button type="submit" disabled={loading}>
              {loading ? "Generazione in corso…" : "Genera descrizione"}
            </Button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
            <h2 className="font-semibold text-lg mb-3">Istruzioni</h2>
            <p className="text-sm text-stone-600">
              La funzione usa un servizio AI per leggere l&apos;immagine e generare una descrizione ottimizzata per il catalogo. Assicurati di avere la variabile d&apos;ambiente <code>OPENAI_API_KEY</code> impostata.
            </p>
            <p className="text-sm text-stone-600">
              Nota: in locale l&apos;immagine deve essere accessibile da OpenAI. Se il sito non è esposto pubblicamente, potrebbe essere necessario un tunnel o un hosting accessibile.
            </p>
          </div>

          {result && (
            <div className="bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
              <h2 className="font-semibold text-lg mb-3">Risultato generato</h2>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-stone-500">Titolo</p>
                  <p className="text-charcoal font-medium">{result.title}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Descrizione breve</p>
                  <p className="text-charcoal">{result.shortDescription}</p>
                </div>
                <div>
                  <p className="text-sm text-stone-500">Descrizione completa</p>
                  <p className="text-charcoal whitespace-pre-line">{result.description}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
