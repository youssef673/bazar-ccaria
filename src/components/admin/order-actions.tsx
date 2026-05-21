"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { ORDER_STATUS_LABELS } from "@/lib/constants";

const statuses = [
  "PENDING",
  "CONFIRMED",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "QUOTE_REQUESTED",
];

export function OrderActions({
  orderId,
  status,
}: {
  orderId: string;
  status: string;
}) {
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: orderId, status: value }),
    });
    setSaving(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Select
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="h-9 text-xs"
      >
        {statuses.map((s) => (
          <option key={s} value={s}>
            {ORDER_STATUS_LABELS[s] || s}
          </option>
        ))}
      </Select>
      <Button size="sm" variant="outline" onClick={save} disabled={saving}>
        {saving ? "Salvataggio..." : "Salva"}
      </Button>
    </div>
  );
}
