import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { OrderActions } from "@/components/admin/order-actions";
import { ORDER_STATUS_LABELS, PAYMENT_STATUS_LABELS } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-charcoal">Ordini</h1>
      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-stone-200 bg-stone-50">
            <tr>
              <th className="p-4 text-left font-medium">N.</th>
              <th className="p-4 text-left font-medium">Cliente</th>
              <th className="p-4 text-left font-medium">Totale</th>
              <th className="p-4 text-left font-medium">Stato</th>
              <th className="p-4 text-left font-medium">Pagamento</th>
              <th className="p-4 text-left font-medium">Azioni</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-stone-100">
                <td className="p-4 font-mono text-xs">{order.orderNumber}</td>
                <td className="p-4">
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-stone-500">{order.customerEmail}</p>
                </td>
                <td className="p-4">{formatPrice(Number(order.total))}</td>
                <td className="p-4">
                  {ORDER_STATUS_LABELS[order.status] || order.status}
                </td>
                <td className="p-4">
                  {PAYMENT_STATUS_LABELS[order.paymentStatus] ||
                    order.paymentStatus}
                </td>
                <td className="p-4">
                  <OrderActions orderId={order.id} status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-8 text-center text-stone-500">Nessun ordine</p>
        )}
      </div>
    </div>
  );
}
