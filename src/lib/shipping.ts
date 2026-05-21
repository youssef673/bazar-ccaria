import {
  COURIER_BASE,
  HEAVY_WEIGHT_THRESHOLD_KG,
  LOCAL_DELIVERY_BASE,
  SHIPPING_RATE_PER_KG,
} from "./constants";

export interface ShippingEstimateInput {
  totalWeightKg: number;
  city: string;
  province: string;
  deliveryMethod: "LOCAL_DELIVERY" | "COURIER" | "PICKUP";
  hasHeavyItems: boolean;
}

export function estimateShippingCost(input: ShippingEstimateInput): {
  estimated: number | null;
  requiresQuote: boolean;
  note: string;
} {
  if (input.deliveryMethod === "PICKUP") {
    return { estimated: 0, requiresQuote: false, note: "Ritiro gratuito in sede" };
  }

  if (input.hasHeavyItems || input.totalWeightKg >= HEAVY_WEIGHT_THRESHOLD_KG) {
    return {
      estimated: null,
      requiresQuote: true,
      note: "Prodotti pesanti: richiedi un preventivo personalizzato per la spedizione",
    };
  }

  const base =
    input.deliveryMethod === "LOCAL_DELIVERY" ? LOCAL_DELIVERY_BASE : COURIER_BASE;
  const weightCost = input.totalWeightKg * SHIPPING_RATE_PER_KG;
  const estimated = Math.round((base + weightCost) * 100) / 100;

  return {
    estimated,
    requiresQuote: false,
    note:
      input.deliveryMethod === "LOCAL_DELIVERY"
        ? "Stima consegna locale — importo definitivo dopo conferma"
        : "Stima corriere — importo definitivo dopo conferma",
  };
}
