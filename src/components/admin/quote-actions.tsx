"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function QuoteActions({
  quoteId,
  status,
}: {
  quoteId: string;
  status: string;
}) {
  const [amount, setAmount] = useState("");
  const [saving, setSaving] = useState(false);

  const quote = async () => {
    const quotedAmount = Number.parseFloat(amount);
    if (!Number.isFinite(quotedAmount) || quotedAmount < 0) return;

    setSaving(true);
    await fetch("/api/quotes", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: quoteId,
        status: "QUOTED",
        quotedAmount,
      }),
    });
    setSaving(false);
  };

  if (status !== "PENDING") return null;

  return (
    <div className="mt-4 flex gap-2">
      <Input
        type="number"
        step="0.01"
        min="0"
        placeholder="Importo EUR"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="h-9 w-32"
      />
      <Button size="sm" onClick={quote} disabled={saving || !amount}>
        {saving ? "Invio..." : "Invia preventivo"}
      </Button>
    </div>
  );
}
