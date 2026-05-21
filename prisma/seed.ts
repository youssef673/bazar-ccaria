import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { CATEGORIES } from "../src/lib/constants";

const prisma = new PrismaClient();

const UNSPLASH = {
  vaso: "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=800&q=80",
  statua: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=800&q=80",
  fontana: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=80",
  arredo: "https://images.unsplash.com/photo-1598902108854-10e335adac99?w=800&q=80",
  giardino: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80",
};

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bazar.ccaria";
  const adminPassword = process.env.ADMIN_PASSWORD || "changeme123";

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "Amministratore",
      role: "ADMIN",
      passwordHash: await bcrypt.hash(adminPassword, 12),
    },
  });

  await prisma.siteSettings.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      storeName: "bazar.ccaria",
      storeEmail: "info@bazar.ccaria",
      storePhone: "+39 390 123 4567",
      whatsappNumber: process.env.WHATSAPP_NUMBER || "393901234567",
      address: "Calabria, Italia",
      pickupAddress: "Via dell'Artigianato 12, Cosenza",
      bankIban: "IT00X0000000000000000000000",
      bankName: "Banca Example",
    },
  });

  for (const [i, cat] of CATEGORIES.entries()) {
    const category = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: i },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        sortOrder: i,
      },
    });

    const samples = [
      {
        name: `${cat.name} Classico`,
        slug: `${cat.slug}-classico`,
        price: 89 + i * 20,
        status: "AVAILABLE" as const,
        material: i === 0 ? "Ceramica" : i === 1 ? "Cemento" : "Terracotta",
        dimensions: "40 x 35 x 55 cm",
        weight: 12,
        productionDays: 7,
        isHeavy: false,
        images: [UNSPLASH.vaso, UNSPLASH.giardino],
      },
      {
        name: `${cat.name} Grande`,
        slug: `${cat.slug}-grande`,
        price: 189 + i * 30,
        status: "AVAILABLE" as const,
        material: i === 1 ? "Cemento" : "Pietra ricostruita",
        dimensions: "70 x 55 x 95 cm",
        weight: 35,
        productionDays: 14,
        isHeavy: true,
        images: [UNSPLASH.statua, UNSPLASH.arredo],
      },
    ];

    for (const p of samples) {
      const product = await prisma.product.upsert({
        where: { slug: p.slug },
        update: {
          material: p.material,
          dimensions: p.dimensions,
          weight: p.weight,
          isHeavy: p.isHeavy,
          productionDays: p.productionDays,
          allowPreorder: p.isHeavy,
          preorderDepositPct: p.isHeavy ? 30 : null,
          stock: p.isHeavy ? 2 : 10,
        },
        create: {
          name: p.name,
          slug: p.slug,
          description: `Descrizione artigianale per ${p.name}. Realizzato a mano con materiali di qualità per esterni.`,
          shortDescription: `Pezzo artigianale della linea ${cat.name}`,
          price: p.price,
          status: p.status,
          material: p.material,
          dimensions: p.dimensions,
          weight: p.weight,
          productionDays: p.productionDays,
          isHeavy: p.isHeavy,
          stock: p.isHeavy ? 2 : 10,
          allowPreorder: p.isHeavy,
          preorderDepositPct: p.isHeavy ? 30 : null,
          featured: i === 0,
          categoryId: category.id,
        },
      });

      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.createMany({
        data: p.images.map((url, sortOrder) => ({
          productId: product.id,
          url,
          alt: `${p.name} - foto ${sortOrder + 1}`,
          sortOrder,
        })),
      });
    }
  }

  const galleryItems = [
    { title: "Giardino mediterraneo", location: "Cosenza", image: UNSPLASH.giardino },
    { title: "Terrazza con vasi", location: "Catanzaro", image: UNSPLASH.vaso },
    { title: "Fontana in pietra", location: "Reggio Calabria", image: UNSPLASH.fontana },
    { title: "Angolo arredo", location: "Tropea", image: UNSPLASH.arredo },
  ];

  await prisma.galleryItem.deleteMany({});
  for (const [i, g] of galleryItems.entries()) {
    await prisma.galleryItem.create({
      data: {
        ...g,
        featured: i < 2,
        sortOrder: i,
        description: "Installazione realizzata dal nostro team in Calabria.",
      },
    });
  }

  console.log("Seed completato. Admin:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
