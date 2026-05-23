import Image from "next/image";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: "Galleria",
  description: "Installazioni e lavori realizzati in Calabria",
};

interface GalleryItem {
  id: string;
  title: string;
  location: string | null;
  image: string | null;
  description: string | null;
  featured: boolean;
  sortOrder: number;
}

async function getGallery(): Promise<GalleryItem[]> {
  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bazar-ccaria.vercel.app";
    const res = await fetch(`${siteUrl}/api/gallery`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      return data.items ?? [];
    }
    return [];
  } catch {
    return [];
  }
}

export default async function GalleriaPage() {
  const items = await getGallery();

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-4">Galleria lavori</h1>
      <p className="text-stone-600 max-w-2xl mb-12">
        Scopri le nostre installazioni nei giardini calabresi: vasi, statue, fontane e arredo.
      </p>

      {items.length === 0 ? (
        <p className="text-stone-500">Galleria in aggiornamento.</p>
      ) : (
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
      )}
    </div>
  );
}
