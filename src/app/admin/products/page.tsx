import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_STATUS_LABELS } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import dynamic from 'next/dynamic';
const ProductDiscountEditor = dynamic(() => import('@/components/admin/product-discount-editor'), { ssr: false });

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: true,
      images: { orderBy: { sortOrder: "asc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:justify-between md:items-end">
        <div>
          <h1 className="font-display text-3xl text-charcoal">Prodotti</h1>
          <p className="text-sm text-stone-600 mt-2">Aggiungi nuovi prodotti e saranno automaticamente visibili nel catalogo.</p>
        </div>
        <Link href="/admin/products/new" className="inline-flex items-center rounded-md bg-terracotta px-4 py-2 text-sm font-medium text-white hover:bg-terracotta-dark">
          Aggiungi prodotto
        </Link>
      </div>
      <div className="bg-white rounded-xl border border-stone-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left p-4">Prodotto</th>
              <th className="text-left p-4">Categoria</th>
              <th className="text-left p-4">Prezzo</th>
              <th className="text-left p-4">Stato</th>
              <th className="text-left p-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-b border-stone-100">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {p.images[0] && (
                      <div className="relative w-12 h-12 rounded overflow-hidden bg-stone-100">
                        <Image src={p.images[0].url} alt="" fill className="object-cover" />
                      </div>
                    )}
                    <div>
                      <Link href={`/prodotto/${p.slug}`} className="font-medium hover:text-terracotta">
                        {p.name}
                      </Link>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-stone-600">{p.category.name}</td>
                <td className="p-4">{formatPrice(Number(p.price))}</td>
                <td className="p-4">
                  <Badge>{PRODUCT_STATUS_LABELS[p.status] || p.status}</Badge>
                </td>
                <td className="p-4">{p.stock}</td>
                <td className="p-4">
                  <ProductDiscountEditor id={p.id} price={Number(p.price)} compareAtPrice={p.compareAtPrice ? Number(p.compareAtPrice) : null} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
