import { prisma } from "@/lib/prisma";
import Link from "next/link";
import ProductCreateForm from "@/components/admin/product-create-form";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } });
}

export default async function AdminNewProductPage() {
  const categories = await getCategories();

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Aggiungi nuovo prodotto</h1>
          <p className="text-sm text-stone-600 mt-2">I prodotti creati qui saranno salvati nel database e visibili nel catalogo.</p>
        </div>
        <Link href="/admin/products" className="inline-flex items-center rounded-md bg-stone-900 px-4 py-2 text-sm text-white hover:bg-stone-800">
          Torna ai prodotti
        </Link>
      </div>
      <ProductCreateForm categories={categories} />
    </div>
  );
}
