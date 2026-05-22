import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { QuoteActions } from "@/components/admin/quote-actions";
import { QUOTE_STATUS_LABELS } from "@/lib/constants";

export const dynamic = 'force-dynamic';

export default async function AdminQuotesPage() {
  const quotes = await prisma.quote.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-charcoal">Preventivi</h1>
      <div className="space-y-4">
        {quotes.map((q) => (
          <div key={q.id} className="rounded-lg border border-stone-200 bg-white p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs text-stone-500">
                  {q.quoteNumber}
                </p>
                <p className="mt-1 font-medium text-charcoal">
                  {q.customerName}
                </p>
                <p className="text-sm text-stone-600">
                  {q.customerEmail} · {q.city}, {q.province}
                </p>
                {q.message && (
                  <p className="mt-2 text-sm text-stone-500">{q.message}</p>
                )}
                <p className="mt-2 text-xs text-stone-400">
                  Peso: {Number(q.totalWeight)} kg ·{" "}
                  {new Date(q.createdAt).toLocaleDateString("it-IT")}
                </p>
              </div>
              <div className="text-right">
                <span className="rounded bg-stone-100 px-2 py-1 text-xs font-medium">
                  {QUOTE_STATUS_LABELS[q.status] || q.status}
                </span>
                {q.quotedAmount && (
                  <p className="mt-2 font-medium text-terracotta">
                    {formatPrice(Number(q.quotedAmount))}
                  </p>
                )}
              </div>
            </div>
            <QuoteActions quoteId={q.id} status={q.status} />
          </div>
        ))}
        {quotes.length === 0 && (
          <p className="text-stone-500">Nessun preventivo</p>
        )}
      </div>
    </div>
  );
}
