const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP || process.env.WHATSAPP_NUMBER || "";

export function buildWhatsAppUrl(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function productInquiryMessage(
  productName: string,
  productUrl: string
): string {
  return `Ciao! Vorrei informazioni su:\n\n*${productName}*\n${productUrl}\n\nGrazie!`;
}

export function orderInquiryMessage(orderNumber: string): string {
  return `Ciao! Vorrei informazioni sul mio ordine *${orderNumber}*`;
}
