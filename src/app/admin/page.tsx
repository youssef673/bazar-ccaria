import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ShoppingCart, Package, FileText } from "lucide-react";

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getStats() {
  const [orders, products, quotes, pendingReviews] = await Promise.all([
    prisma.order.count(),
    prisma.product.count(),
    prisma.quote.count({ where: { status: "PENDING" } }),
    prisma.review.count({ where: { approved: false } }),
  ]);
  return { orders, products, quotes, pendingReviews };
}

export default async function AdminDashboardPage() {
  const stats = await getStats();

  const cards = [
    { label: "Ordini totali", value: stats.orders, href: "/admin/orders", icon: ShoppingCart },
    { label: "Prodotti", value: stats.products, href: "/admin/products", icon: Package },
    { label: "Preventivi in attesa", value: stats.quotes, href: "/admin/quotes", icon: FileText },
  ];

  return (
    <div>
      <h1 className="font-display text-3xl text-charcoal mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map(({ label, value, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="p-6 bg-white rounded-xl border border-stone-200 hover:border-terracotta transition-colors"
          >
            <Icon className="h-8 w-8 text-terracotta mb-4" />
            <p className="text-3xl font-display text-charcoal">{value}</p>
            <p className="text-stone-600 text-sm mt-1">{label}</p>
          </Link>
        ))}
      </div>
      {stats.pendingReviews > 0 && (
        <p className="mt-8 text-sm text-amber-800 bg-amber-50 p-4 rounded-lg">
          {stats.pendingReviews} recensioni in attesa di approvazione
        </p>
      )}
    </div>
  );
}
