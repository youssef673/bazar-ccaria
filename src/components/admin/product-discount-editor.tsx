"use client";

import { useState } from "react";

export default function ProductDiscountEditor({ id, price, compareAtPrice }: { id: string; price: number; compareAtPrice?: number | null }) {
  const [discountPrice, setDiscountPrice] = useState<string>(compareAtPrice ? String(compareAtPrice) : "");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const apply = async () => {
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch('/api/admin/products', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, compareAtPrice: discountPrice ? Number(discountPrice) : null }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Errore');
      setMsg('Sconto applicato');
    } catch (e: any) {
      setMsg(e.message || 'Errore');
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(null), 3000);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <input type="number" min="0" step="0.01" className="w-28 rounded border px-2 py-1 text-sm" value={discountPrice} onChange={(e) => setDiscountPrice(e.target.value)} placeholder="Prezzo scontato" />
      <button type="button" onClick={apply} disabled={loading} className="rounded bg-terracotta px-3 py-1 text-white text-sm">{loading ? '...' : 'Applica'}</button>
      {msg && <span className="text-sm text-stone-600">{msg}</span>}
    </div>
  );
}
