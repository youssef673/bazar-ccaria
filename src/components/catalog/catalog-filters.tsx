"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PRODUCT_STATUS_LABELS } from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedCategory = searchParams.get("categoria") || "";
  const selectedStatus = searchParams.get("stato") || "";
  const selectedSort = searchParams.get("ordinamento") || "newest";
  const query = searchParams.get("q") || "";
  const activeFilters = [query, selectedCategory, selectedStatus].filter(
    Boolean
  ).length;

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextValue = value.trim();
      if (nextValue) params.set(key, nextValue);
      else params.delete(key);
      const nextQuery = params.toString();
      router.push(nextQuery ? `/catalogo?${nextQuery}` : "/catalogo");
    },
    [router, searchParams]
  );

  const clear = () => router.push("/catalogo");
  const categoryLabel = categories.find(
    (c) => c.slug === selectedCategory
  )?.name;

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-terracotta" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
            Filtri
          </h2>
        </div>
        {activeFilters > 0 && (
          <span className="rounded-full bg-terracotta/10 px-2.5 py-1 text-xs font-semibold text-terracotta-dark">
            {activeFilters}
          </span>
        )}
      </div>

      {activeFilters > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {query && (
            <button
              type="button"
              onClick={() => update("q", "")}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200"
            >
              {query}
              <X className="h-3 w-3" />
            </button>
          )}
          {categoryLabel && (
            <button
              type="button"
              onClick={() => update("categoria", "")}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200"
            >
              {categoryLabel}
              <X className="h-3 w-3" />
            </button>
          )}
          {selectedStatus && (
            <button
              type="button"
              onClick={() => update("stato", "")}
              className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200"
            >
              {PRODUCT_STATUS_LABELS[selectedStatus] || selectedStatus}
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
      )}

      <div className="space-y-5">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            const form = event.currentTarget;
            const formData = new FormData(form);
            update("q", String(formData.get("q") || ""));
          }}
        >
          <Label htmlFor="q">Cerca</Label>
          <div className="mt-1 flex gap-2">
            <Input
              id="q"
              name="q"
              placeholder="Nome, materiale..."
              defaultValue={query}
              className="min-w-0"
            />
            <Button type="submit" size="icon" aria-label="Cerca prodotti">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </form>

        <div>
          <Label htmlFor="categoria">Categoria</Label>
          <Select
            id="categoria"
            value={selectedCategory}
            onChange={(e) => update("categoria", e.target.value)}
            className="mt-1"
          >
            <option value="">Tutte</option>
            {categories.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="stato">Disponibilità</Label>
          <Select
            id="stato"
            value={selectedStatus}
            onChange={(e) => update("stato", e.target.value)}
            className="mt-1"
          >
            <option value="">Tutti</option>
            {Object.entries(PRODUCT_STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="ordinamento">Ordina per</Label>
          <Select
            id="ordinamento"
            value={selectedSort}
            onChange={(e) => update("ordinamento", e.target.value)}
            className="mt-1"
          >
            <option value="newest">Più recenti</option>
            <option value="price-asc">Prezzo crescente</option>
            <option value="price-desc">Prezzo decrescente</option>
            <option value="name">Nome A-Z</option>
          </Select>
        </div>

        <Button
          variant="outline"
          onClick={clear}
          className="w-full"
          disabled={activeFilters === 0 && selectedSort === "newest"}
        >
          Cancella filtri
        </Button>
      </div>
    </div>
  );
}
