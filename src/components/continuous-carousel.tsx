"use client";

import Image from 'next/image';

export default function ContinuousCarousel({ products, title }: { products: any[]; title: string }) {
  return (
    <section className="py-8">
      <div className="container mx-auto px-4">
        <h3 className="font-display text-2xl mb-4">{title}</h3>
        <div className="overflow-hidden">
          <div className="flex animate-marquee gap-6">
            {products.concat(products).map((p, i) => (
              <div key={p.id + '-' + i} className="w-48 flex-shrink-0 rounded-lg bg-white p-3 shadow-sm">
                {p.images?.[0]?.url ? (
                  <div className="relative h-28 w-full mb-2">
                    <Image src={p.images[0].url} alt={p.name} fill className="object-cover rounded" />
                  </div>
                ) : null}
                <div className="text-sm font-medium">{p.name}</div>
                <div className="text-sm text-terracotta">€{Number(p.price).toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee { display: flex; gap: 1rem; animation: marquee 18s linear infinite; }
      `}</style>
    </section>
  );
}
