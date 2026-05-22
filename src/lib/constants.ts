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

export const MATERIAL_OPTIONS = [
  "Ceramica",
  "Cemento",
  "Terracotta",
  "Pietra ricostruita",
] as const;

export const PRICE_RANGES = [
  { label: "Fino a 100 euro", min: 0, max: 100 },
  { label: "100 - 200 euro", min: 100, max: 200 },
  { label: "200 - 400 euro", min: 200, max: 400 },
  { label: "Oltre 400 euro", min: 400, max: null },
] as const;

export const TRUST_SIGNALS = [
  {
    title: "Foto e misure prima della conferma",
    text: "Su richiesta inviamo dettagli, foto ravvicinate e video del pezzo disponibile.",
  },
  {
    title: "Consegna tracciata in Calabria",
    text: "Stima immediata per prodotti leggeri e preventivo dedicato per pezzi pesanti.",
  },
  {
    title: "Assistenza WhatsApp",
    text: "Prima dell'acquisto puoi parlare con noi per misure, posa, materiali e tempi.",
  },
  {
    title: "Pagamenti flessibili",
    text: "Carta, bonifico, pagamento alla consegna o caparra per prodotti su ordinazione.",
  },
] as const;

export const LOCAL_SEO_PROVINCES = [
  {
    province: "Cosenza",
    text: "Consegna locale per giardini, ville, terrazzi e strutture ricettive nell'area di Cosenza, Rende, Paola e costa tirrenica.",
  },
  {
    province: "Catanzaro",
    text: "Arredo esterno, vasi e fontane per Catanzaro, Lamezia Terme, Soverato e localita' della costa ionica.",
  },
  {
    province: "Reggio Calabria",
    text: "Soluzioni decorative per Reggio Calabria, Gioia Tauro, Palmi e giardini privati lungo lo Stretto.",
  },
  {
    province: "Crotone",
    text: "Preventivi per decorazioni da esterno, statue e fontane nell'area di Crotone e Isola di Capo Rizzuto.",
  },
  {
    province: "Vibo Valentia",
    text: "Consegna e preventivi per Tropea, Pizzo, Vibo Valentia e giardini costieri.",
  },
] as const;

export const PRODUCT_CARE_NOTES = [
  "Pulire con acqua e panno morbido, evitando detergenti aggressivi.",
  "Per pezzi in cemento o pietra, verificare la base di appoggio prima della posa.",
  "In zone molto esposte al vento consigliamo fissaggio o collocazione riparata.",
] as const;

export const DELIVERY_ESTIMATE_BY_PROVINCE: Record<string, string> = {
  Cosenza: "2-4 giorni lavorativi",
  Catanzaro: "3-5 giorni lavorativi",
  "Reggio Calabria": "4-6 giorni lavorativi",
  Crotone: "3-6 giorni lavorativi",
  "Vibo Valentia": "4-6 giorni lavorativi",
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
