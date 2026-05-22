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
  const [material, setMaterial] = useState("");
  const [dimensions, setDimensions] = useState("");
  const [weight, setWeight] = useState(0);
  const [productionDays, setProductionDays] = useState(0);
  const [allowPreorder, setAllowPreorder] = useState(false);
  const [isHeavy, setIsHeavy] = useState(false);
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);
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
    formData.append("material", material);
    formData.append("dimensions", dimensions);
    formData.append("weight", String(weight));
    formData.append("productionDays", String(productionDays));
    formData.append("preorderDepositPct", "30");
    if (allowPreorder) formData.append("allowPreorder", "on");
    if (isHeavy) formData.append("isHeavy", "on");
    formData.append("shortDescription", shortDescription);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }
    if (images) {
      Array.from(images).forEach((file) => formData.append("images", file));
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
      setMaterial("");
      setDimensions("");
      setWeight(0);
      setProductionDays(0);
      setAllowPreorder(false);
      setIsHeavy(false);
      setShortDescription("");
      setDescription("");
      setImage(null);
      setImages(null);
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

      <div className="grid gap-6 lg:grid-cols-4">
        <div>
          <Label htmlFor="material">Materiale</Label>
          <Input
            id="material"
            value={material}
            placeholder="Ceramica, cemento..."
            onChange={(event) => setMaterial(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="dimensions">Dimensioni</Label>
          <Input
            id="dimensions"
            value={dimensions}
            placeholder="Es. 40 x 60 cm"
            onChange={(event) => setDimensions(event.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="weight">Peso (kg)</Label>
          <Input
            id="weight"
            type="number"
            min="0"
            step="0.1"
            value={weight || ""}
            onChange={(event) => {
              const value = Number(event.target.value);
              setWeight(value);
              if (value >= 30) setIsHeavy(true);
            }}
          />
        </div>
        <div>
          <Label htmlFor="productionDays">Giorni produzione</Label>
          <Input
            id="productionDays"
            type="number"
            min="0"
            step="1"
            value={productionDays || ""}
            onChange={(event) => setProductionDays(Number(event.target.value))}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <select
            id="category"
            title="Categoria"
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
            title="Stato"
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
          <Input id="image" type="file" accept="image/jpeg,image/png,image/webp" onChange={(event) => setImage(event.target.files?.[0] || null)} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_1fr_2fr]">
        <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={isHeavy}
            onChange={(event) => setIsHeavy(event.target.checked)}
          />
          Prodotto pesante
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm">
          <input
            type="checkbox"
            checked={allowPreorder}
            onChange={(event) => setAllowPreorder(event.target.checked)}
          />
          Consenti preordine
        </label>
        <div>
          <Label htmlFor="images">Foto aggiuntive (fino a 6)</Label>
          <Input
            id="images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => setImages(event.target.files)}
          />
          <p className="mt-1 text-xs text-stone-500">
            Consigliate: foto frontale, dettaglio materiale, vista ambientata e
            riferimento dimensioni.
          </p>
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
