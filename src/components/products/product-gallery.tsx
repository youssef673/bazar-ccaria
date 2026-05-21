"use client";

import { useState } from "react";
import Image from "next/image";
import { Package, ZoomIn, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductGalleryProps {
  images: { url: string; alt?: string | null }[];
  name: string;
}

export function ProductGallery({ images, name }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const current = images[selected] || images[0];

  if (!current) {
    return (
      <div className="flex aspect-square items-center justify-center rounded-lg bg-stone-100 text-stone-400">
        <Package className="h-12 w-12" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className="group relative aspect-square cursor-zoom-in overflow-hidden rounded-lg bg-stone-100"
        onClick={() => setZoomed(true)}
        role="button"
        aria-label="Apri immagine ingrandita"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setZoomed(true);
          }
        }}
      >
        <Image
          src={current.url}
          alt={current.alt || name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/10">
          <ZoomIn className="h-8 w-8 text-white opacity-0 drop-shadow transition-opacity group-hover:opacity-100" />
        </div>
      </div>

      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={img.url}
              type="button"
              onClick={() => setSelected(i)}
              title={
                img.alt ? `Anteprima ${img.alt}` : `Anteprima immagine ${i + 1}`
              }
              aria-label={
                img.alt ? `Anteprima ${img.alt}` : `Anteprima immagine ${i + 1}`
              }
              aria-current={selected === i}
              className={cn(
                "relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-colors",
                selected === i ? "border-terracotta" : "border-transparent"
              )}
            >
              <Image
                src={img.url}
                alt={img.alt || `Anteprima immagine ${i + 1}`}
                fill
                className="object-cover"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Immagine prodotto ingrandita"
        >
          <button
            type="button"
            className="absolute right-4 top-4 p-2 text-white"
            onClick={() => setZoomed(false)}
            aria-label="Chiudi"
          >
            <X className="h-8 w-8" />
          </button>
          <div className="relative aspect-square w-full max-w-4xl">
            <Image
              src={current.url}
              alt={current.alt || name}
              fill
              className="object-contain"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
