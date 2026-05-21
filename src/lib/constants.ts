export const CALABRIA_PROVINCES = [
  "Cosenza",
  "Catanzaro",
  "Reggio Calabria",
  "Crotone",
  "Vibo Valentia",
] as const;

export const CALABRIA_CITIES: Record<string, string[]> = {
  Cosenza: [
    "Cosenza",
    "Rende",
    "Castrovillari",
    "Rossano",
    "Paola",
    "Amantea",
    "Scalea",
    "Corigliano-Rossano",
    "Montalto Uffugo",
  ],
  Catanzaro: [
    "Catanzaro",
    "Lamezia Terme",
    "Soverato",
    "Siderno",
    "Locri",
    "Gioiosa Ionica",
    "Sellia Marina",
    "Squillace",
  ],
  "Reggio Calabria": [
    "Reggio Calabria",
    "Palmi",
    "Siderno",
    "Locri",
    "Gioia Tauro",
    "Rosarno",
    "Melito di Porto Salvo",
    "Bagnara Calabra",
  ],
  Crotone: ["Crotone", "Cutro", "Isola di Capo Rizzuto", "Strongoli", "Santa Severina"],
  "Vibo Valentia": [
    "Vibo Valentia",
    "Pizzo",
    "Tropea",
    "Serra San Bruno",
    "Nicotera",
    "Ricadi",
  ],
};

export const CATEGORIES = [
  {
    name: "Vasi in Ceramica",
    slug: "vasi-ceramica",
    description: "Vasi artigianali in ceramica per giardino e terrazzo",
  },
  {
    name: "Statue in Cemento",
    slug: "statue-cemento",
    description: "Statue decorative in cemento per esterni",
  },
  {
    name: "Fontane da Giardino",
    slug: "fontane-giardino",
    description: "Fontane decorative per il tuo spazio verde",
  },
  {
    name: "Decorazioni da Esterno",
    slug: "decorazioni-esterno",
    description: "Elementi decorativi per esterni",
  },
  {
    name: "Arredo Giardino",
    slug: "arredo-giardino",
    description: "Mobili e complementi per il giardino",
  },
] as const;

export const PRODUCT_STATUS_LABELS: Record<string, string> = {
  AVAILABLE: "Disponibile",
  PREORDER: "Preordine",
  ON_ORDER: "Su ordinazione",
  OUT_OF_STOCK: "Esaurito",
};

export const PRODUCT_STATUS_COLORS: Record<string, string> = {
  AVAILABLE: "bg-sage/20 text-sage-dark",
  PREORDER: "bg-terracotta/20 text-terracotta-dark",
  ON_ORDER: "bg-stone-200 text-stone-700",
  OUT_OF_STOCK: "bg-red-100 text-red-700",
};

export const DELIVERY_METHOD_LABELS: Record<string, string> = {
  LOCAL_DELIVERY: "Consegna locale",
  COURIER: "Corriere",
  PICKUP: "Ritiro in sede",
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "In attesa",
  CONFIRMED: "Confermato",
  PROCESSING: "In lavorazione",
  SHIPPED: "Spedito",
  DELIVERED: "Consegnato",
  CANCELLED: "Annullato",
  QUOTE_REQUESTED: "Preventivo richiesto",
};

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  STRIPE_CARD: "Carta di credito",
  PAYPAL: "PayPal",
  BANK_TRANSFER: "Bonifico bancario",
  CASH_ON_DELIVERY: "Pagamento alla consegna",
  DEPOSIT: "Caparra + saldo",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Pagamento in attesa",
  DEPOSIT_PAID: "Caparra pagata",
  PAID: "Pagato",
  REFUNDED: "Rimborsato",
  FAILED: "Pagamento fallito",
};

export const QUOTE_STATUS_LABELS: Record<string, string> = {
  PENDING: "In valutazione",
  QUOTED: "Preventivo inviato",
  ACCEPTED: "Accettato",
  REJECTED: "Rifiutato",
  EXPIRED: "Scaduto",
};

export const HEAVY_WEIGHT_THRESHOLD_KG = 30;

export const SHIPPING_RATE_PER_KG = 0.8;
export const LOCAL_DELIVERY_BASE = 15;
export const COURIER_BASE = 25;
