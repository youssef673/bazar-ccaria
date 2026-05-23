import { GalleryItems } from "@/components/gallery/gallery-items";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export const metadata = {
  title: "Galleria",
  description: "Installazioni e lavori realizzati in Calabria",
};

export default async function GalleriaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-4">Galleria lavori</h1>
      <p className="text-stone-600 max-w-2xl mb-12">
        Scopri le nostre installazioni nei giardini calabresi: vasi, statue, fontane e arredo.
      </p>
      <GalleryItems />
    </div>
  );
}
