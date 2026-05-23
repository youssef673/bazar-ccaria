"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface GalleryItem {
  id: string;
  title: string;
  location: string | null;
  image: string | null;
  description: string | null;
  featured: boolean;
  sortOrder: number;
}

export function GalleryItems() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/gallery", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setItems(data.items ?? []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="aspect-[4/3] bg-stone-200 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return <p className="text-stone-500">Galleria in aggiornamento.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <article
          key={item.id}
          className="group relative aspect-[4/3] rounded-xl overflow-hidden bg-stone-200"
        >
          {item.image ? (
            <Image
              src={item.image}
              alt={item.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 bg-stone-200 flex items-center justify-center text-stone-400 text-sm">
              Immagine non disponibile
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-cream translate-y-2 group-hover:translate-y-0 transition-transform">
            <h2 className="font-display text-xl">{item.title}</h2>
            {item.location && (
              <p className="text-sm text-stone-300">{item.location}</p>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}
