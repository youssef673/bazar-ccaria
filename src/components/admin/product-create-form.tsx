"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: string;
  name: string;
};

type ProductCreateFormProps = {
  categories: Category[];
};

const statuses = [
  { value: "AVAILABLE", label: "Disponibile" },
  { value: "PREORDER", label: "Preordine" },
  { value: "ON_ORDER", label: "Su ordinazione" },
  { value: "OUT_OF_STOCK", label: "Esaurito" },
];

export default function ProductCreateForm({ categories }: ProductCreateFormProps) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [price, setPrice] = useState(0);
  const [compareAtPrice, setCompareAtPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [status, setStatus] = useState("AVAILABLE");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [createdSlug, setCreatedSlug] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setCreatedSlug(null);

    if (!name) {
      setError("Il nome del prodotto è obbligatorio.");
      return;
    }
    if (!description) {
      setError("La descrizione è obbligatoria.");
      return;
    }
    if (!price || price <= 0) {
      setError("Inserisci un prezzo valido.");
      return;
    }
    if (!categoryId) {
      setError("Seleziona una categoria.");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("slug", slug);
    formData.append("categoryId", categoryId);
    formData.append("price", String(price));
    formData.append("compareAtPrice", String(compareAtPrice));
    formData.append("stock", String(stock));
    formData.append("status", status);
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    setLoading(true);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Errore durante la creazione del prodotto.");
      }

      setMessage("Prodotto creato con successo.");
      setCreatedSlug(data.product?.slug ?? null);
      setName("");
      setSlug("");
      setPrice(0);
      setCompareAtPrice(0);
      setStock(0);
      setShortDescription("");
      setDescription("");
      setImage(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore sconosciuto.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 bg-white rounded-xl border border-stone-200 p-6 shadow-sm">
      {message && <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-800">{message}</div>}
      {error && <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">{error}</div>}
      {createdSlug && (
        <div className="rounded-md bg-slate-50 p-4 text-sm text-slate-800">
          Prodotto creato: <Link href={`/prodotto/${createdSlug}`} className="font-medium text-terracotta hover:underline">Visualizza prodotto</Link>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <Label htmlFor="name">Nome</Label>
          <Input id="name" value={name} onChange={(event) => setName(event.target.value)} />
        </div>
        <div>
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input id="slug" value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="Opzionale: lasciarlo vuoto per generare automaticamente" />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <Label htmlFor="price">Prezzo (€)</Label>
          <Input id="price" type="number" min="0" step="0.01" value={price || ""} onChange={(event) => setPrice(Number(event.target.value))} />
        </div>
        <div>
          <Label htmlFor="compareAtPrice">Prezzo comparativo (€)</Label>
          <Input id="compareAtPrice" type="number" min="0" step="0.01" value={compareAtPrice || ""} onChange={(event) => setCompareAtPrice(Number(event.target.value))} />
        </div>
        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" type="number" min="0" step="1" value={stock || ""} onChange={(event) => setStock(Number(event.target.value))} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            className="mt-2 block w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-charcoal"
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="status">Stato</Label>
          <select
            id="status"
            className="mt-2 block w-full rounded-md border border-stone-300 bg-white px-4 py-2 text-sm text-charcoal"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {statuses.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <Label htmlFor="image">Immagine</Label>
          <Input id="image" type="file" accept="image/*" onChange={(event) => setImage(event.target.files?.[0] || null)} />
        </div>
      </div>

      <div>
        <Label htmlFor="shortDescription">Descrizione breve</Label>
        <Textarea id="shortDescription" value={shortDescription} onChange={(event) => setShortDescription(event.target.value)} />
      </div>

      <div>
        <Label htmlFor="description">Descrizione completa</Label>
        <Textarea id="description" value={description} onChange={(event) => setDescription(event.target.value)} />
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Salvataggio..." : "Salva prodotto"}
        </Button>
      </div>
    </form>
  );
}
