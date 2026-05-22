import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Heart, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { TrustPanel } from "@/components/commerce/trust-panel";
import { prisma } from "@/lib/prisma";
import { CATEGORIES } from "@/lib/constants";
import ContinuousCarousel from '@/components/continuous-carousel';

const categoryImages = [
  "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=900&q=80",
  "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=900&q=80",
  "https://images.unsplash.com/photo-1620127807580-990c3e23b7d0?w=900&q=80",
  "https://images.unsplash.com/photo-1598902108854-10e335adac99?w=900&q=80",
  "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?w=900&q=80",
];

async function getFeaturedProducts() {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      include: {
        images: { orderBy: { sortOrder: "asc" }, take: 1 },
        category: { select: { name: true, slug: true } },
      },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function getTopSellers() {
  try {
    return await prisma.product.findMany({
      where: { featured: true },
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      take: 9,
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

async function getNewArrivals() {
  try {
    return await prisma.product.findMany({
      include: { images: { orderBy: { sortOrder: 'asc' }, take: 1 } },
      take: 9,
      orderBy: { createdAt: 'desc' },
    });
  } catch { return []; }
}

async function getGalleryPreview() {
  try {
    return await prisma.galleryItem.findMany({
      where: { featured: true },
      take: 4,
      orderBy: { sortOrder: "asc" },
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [featured, topSellers, newArrivals, gallery] = await Promise.all([
    getFeaturedProducts(),
    getTopSellers(),
    getNewArrivals(),
    getGalleryPreview(),
  ]);

  return (
    <>
      <section className="relative flex min-h-[85vh] items-center">
        <div className="absolute inset-0 bg-stone-900">
          <Image
            src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1920&q=80"
            alt="Giardino con decorazioni artigianali"
            fill
            className="object-cover opacity-50"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-charcoal/40 to-charcoal/80" />
        </div>
        <div className="container relative z-10 mx-auto px-4 py-24">
          <p className="mb-4 animate-fade-in text-sm uppercase tracking-[0.3em] text-terracotta-light">
            Artigianato · Natura · Calabria
          </p>
          <h1 className="max-w-4xl animate-slide-up text-balance font-display text-5xl leading-tight text-cream md:text-7xl lg:text-8xl">
            Il tuo giardino,
            <br />
            <span className="text-terracotta-light">opera d&apos;arte</span>
          </h1>
          <p className="mt-6 max-w-xl animate-slide-up text-lg text-stone-300 md:text-xl">
            Vasi in ceramica, statue in cemento, fontane e arredo per esterni.
            Creazioni artigianali consegnate in tutta la Calabria.
          </p>
          <div className="mt-10 flex animate-slide-up flex-wrap gap-4">
            <Button asChild size="lg" className="text-base">
              <Link href="/catalogo">
                Esplora il catalogo
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-cream/30 text-cream hover:bg-cream/10"
            >
              <Link href="/galleria">Galleria lavori</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-y border-sage/20 bg-sage/10 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Truck, text: "Consegna in Calabria" },
              { icon: Shield, text: "Pagamenti sicuri" },
              { icon: Heart, text: "Fatto a mano" },
              { icon: Leaf, text: "Materiali naturali" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center justify-center gap-3">
                <Icon className="h-5 w-5 shrink-0 text-sage" />
                <span className="text-sm font-medium text-charcoal">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-14 text-center">
            <h2 className="font-display text-4xl text-charcoal md:text-5xl">
              Le nostre categorie
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-stone-600">
              Scopri la nostra selezione di prodotti artigianali per il tuo
              spazio verde.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/catalogo/${cat.slug}`}
                className="group relative aspect-[4/3] overflow-hidden rounded-lg bg-stone-200 shadow-sm transition-shadow hover:shadow-lg"
              >
                <Image
                  src={categoryImages[i % categoryImages.length]}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-display text-2xl text-cream">{cat.name}</h3>
                  <p className="mt-1 text-sm text-stone-300 opacity-0 transition-opacity group-hover:opacity-100">
                    Scopri →
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {topSellers.length > 0 && (
        <section className="bg-stone-50 py-8">
          <div className="container mx-auto px-4">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <h2 className="font-display text-3xl text-charcoal">Più venduti</h2>
                <p className="text-stone-600">I prodotti più richiesti</p>
              </div>
            </div>
          </div>
          <div>
            <ContinuousCarousel products={topSellers} title="Più venduti" />
          </div>
        </section>
      )}

      {featured.length > 0 ? (
        <section className="bg-stone-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 flex items-end justify-between gap-6">
              <div>
                <h2 className="font-display text-4xl text-charcoal">
                  In evidenza
                </h2>
                <p className="mt-2 text-stone-600">I nostri pezzi più amati</p>
              </div>
              <Button asChild variant="outline">
                <Link href="/catalogo">Vedi tutti</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featured.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: Number(product.price),
                    compareAtPrice: product.compareAtPrice
                      ? Number(product.compareAtPrice)
                      : null,
                    material: product.material,
                    dimensions: product.dimensions,
                    weight: product.weight ? Number(product.weight) : null,
                    isHeavy: product.isHeavy,
                    productionDays: product.productionDays,
                  }}
                />
              ))}
            </div>
            {newArrivals.length > 0 && (
              <div className="mt-8">
                {/* placeholder for new arrivals carousel */}
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="bg-stone-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="font-display text-4xl text-charcoal">
              Catalogo in aggiornamento
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-stone-600">
              Stiamo preparando la selezione in evidenza. Puoi comunque
              sfogliare tutte le categorie disponibili.
            </p>
            <Button asChild className="mt-6">
              <Link href="/catalogo">Apri il catalogo</Link>
            </Button>
          </div>
        </section>
      )}

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 max-w-2xl">
            <h2 className="font-display text-3xl text-charcoal md:text-4xl">
              Acquisto seguito, non impersonale
            </h2>
            <p className="mt-2 text-stone-600">
              Per pezzi artigianali, misure e consegna contano. Ti aiutiamo a
              verificare il prodotto prima dell&apos;ordine e a scegliere la
              soluzione piu adatta al tuo spazio.
            </p>
          </div>
          <TrustPanel />
        </div>
      </section>

      <section className="bg-charcoal py-20 text-cream md:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <h2 className="font-display text-4xl md:text-5xl">
            Consegna esclusiva in Calabria
          </h2>
          <p className="mt-6 leading-relaxed text-stone-400">
            Serviamo Cosenza, Catanzaro, Reggio Calabria, Crotone e Vibo
            Valentia. Consegna locale, corriere o ritiro in sede. Per prodotti
            pesanti, richiedi un preventivo personalizzato.
          </p>
          <Button asChild variant="secondary" className="mt-8" size="lg">
            <Link href="/consegne">Scopri le zone servite</Link>
          </Button>
        </div>
      </section>

      {gallery.length > 0 && (
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mb-12 text-center">
              <h2 className="font-display text-4xl text-charcoal">
                Galleria lavori
              </h2>
              <p className="mt-2 text-stone-600">
                Installazioni reali nei giardini calabresi
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {gallery.map((item) => (
                <Link
                  key={item.id}
                  href="/galleria"
                  className="group relative aspect-square overflow-hidden rounded-lg bg-stone-100"
                >
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-stone-200 text-sm text-stone-400">
                      Immagine non disponibile
                    </div>
                  )}
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild variant="outline">
                <Link href="/galleria">Vedi tutta la galleria</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
