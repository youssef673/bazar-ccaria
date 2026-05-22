"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  MATERIAL_OPTIONS,
  PRICE_RANGES,
  PRODUCT_STATUS_LABELS,
} from "@/lib/constants";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function CatalogFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [expanded, setExpanded] = useState(false);
  const selectedCategory = searchParams.get("categoria") || "";
  const selectedStatus = searchParams.get("stato") || "";
  const selectedSort = searchParams.get("ordinamento") || "newest";
  const selectedMaterial = searchParams.get("materiale") || "";
  const selectedMin = searchParams.get("min") || "";
  const selectedMax = searchParams.get("max") || "";
  const selectedHeavy = searchParams.get("pesante") || "";
  const selectedAvailable = searchParams.get("disponibile") === "1";
  const query = searchParams.get("q") || "";
  const activeFilters = [
    query,
    selectedCategory,
    selectedStatus,
    selectedMaterial,
    selectedMin,
    selectedMax,
    selectedHeavy,
    selectedAvailable ? "1" : "",
  ].filter(Boolean).length;

  const pushParams = useCallback(
    (params: URLSearchParams) => {
      const nextQuery = params.toString();
      router.push(nextQuery ? `/catalogo?${nextQuery}` : "/catalogo");
    },
    [router]
  );

  const update = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const nextValue = value.trim();
      if (nextValue) params.set(key, nextValue);
      else params.delete(key);
      pushParams(params);
    },
    [pushParams, searchParams]
  );

  const updatePrice = (value: string) => {
    const [min, max] = value.split(":");
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("min", min);
    else params.delete("min");
    if (max) params.set("max", max);
    else params.delete("max");
    pushParams(params);
  };

  const clearPrice = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("min");
    params.delete("max");
    pushParams(params);
  };

  const clear = () => router.push("/catalogo");
  const categoryLabel = categories.find(
    (c) => c.slug === selectedCategory
  )?.name;
  const priceLabel = PRICE_RANGES.find(
    (range) =>
      String(range.min) === selectedMin &&
      String(range.max ?? "") === selectedMax
  )?.label;

  return (
    <div className="bg-white rounded-lg border border-stone-200 p-5 shadow-sm lg:sticky lg:top-24">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-terracotta" />
          <h2 className="text-sm font-semibold uppercase tracking-wider text-charcoal">
            Filtri
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {activeFilters > 0 && (
            <span className="rounded-full bg-terracotta/10 px-2.5 py-1 text-xs font-semibold text-terracotta-dark">
              {activeFilters}
            </span>
          )}
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="lg:hidden inline-flex items-center gap-1 rounded-md border border-stone-200 px-2.5 py-1.5 text-xs font-medium text-stone-700"
            aria-expanded={expanded}
          >
            {expanded ? "Nascondi" : "Mostra"}
            <ChevronDown
              className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")}
            />
          </button>
        </div>
      </div>

      <div className={cn("lg:block", expanded ? "block" : "hidden")}>
      {activeFilters > 0 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {query && (
            <FilterChip label={query} onClear={() => update("q", "")} />
          )}
          {categoryLabel && (
            <FilterChip
              label={categoryLabel}
              onClear={() => update("categoria", "")}
            />
          )}
          {selectedStatus && (
            <FilterChip
              label={PRODUCT_STATUS_LABELS[selectedStatus] || selectedStatus}
              onClear={() => update("stato", "")}
            />
          )}
          {selectedMaterial && (
            <FilterChip
              label={selectedMaterial}
              onClear={() => update("materiale", "")}
            />
          )}
          {(selectedMin || selectedMax) && (
            <FilterChip
              label={priceLabel || "Prezzo selezionato"}
              onClear={clearPrice}
            />
          )}
          {selectedHeavy && (
            <FilterChip
              label={
                selectedHeavy === "1" ? "Prodotti pesanti" : "Prodotti leggeri"
              }
              onClear={() => update("pesante", "")}
            />
          )}
          {selectedAvailable && (
            <FilterChip
              label="Disponibili ora"
              onClear={() => update("disponibile", "")}
            />
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
          <Label htmlFor="stato">Disponibilita</Label>
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
          <Label htmlFor="materiale">Materiale</Label>
          <Select
            id="materiale"
            value={selectedMaterial}
            onChange={(e) => update("materiale", e.target.value)}
            className="mt-1"
          >
            <option value="">Tutti</option>
            {MATERIAL_OPTIONS.map((material) => (
              <option key={material} value={material}>
                {material}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="prezzo">Prezzo</Label>
          <Select
            id="prezzo"
            value={`${selectedMin}:${selectedMax}`}
            onChange={(e) => updatePrice(e.target.value)}
            className="mt-1"
          >
            <option value=":">Tutti</option>
            {PRICE_RANGES.map((range) => (
              <option
                key={range.label}
                value={`${range.min}:${range.max ?? ""}`}
              >
                {range.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <Label htmlFor="pesante">Peso e consegna</Label>
          <Select
            id="pesante"
            value={selectedHeavy}
            onChange={(e) => update("pesante", e.target.value)}
            className="mt-1"
          >
            <option value="">Tutti</option>
            <option value="0">Prodotti leggeri</option>
            <option value="1">Prodotti pesanti</option>
          </Select>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-700">
          <input
            type="checkbox"
            checked={selectedAvailable}
            onChange={(e) => update("disponibile", e.target.checked ? "1" : "")}
            className="h-4 w-4 rounded border-stone-300 text-terracotta"
          />
          Solo disponibili o ordinabili
        </label>

        <div>
          <Label htmlFor="ordinamento">Ordina per</Label>
          <Select
            id="ordinamento"
            value={selectedSort}
            onChange={(e) => update("ordinamento", e.target.value)}
            className="mt-1"
          >
            <option value="newest">Piu recenti</option>
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
    </div>
  );
}

function FilterChip({
  label,
  onClear,
}: {
  label: string;
  onClear: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700 hover:bg-stone-200"
    >
      {label}
      <X className="h-3 w-3" />
    </button>
  );
}
