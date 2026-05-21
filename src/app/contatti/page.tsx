import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Contatti",
  description: "Contatta bazar.ccaria per informazioni e ordini",
};

async function getSettings() {
  try {
    return await prisma.siteSettings.findUnique({ where: { id: "default" } });
  } catch {
    return null;
  }
}

export default async function ContattiPage() {
  const settings = await getSettings();
  const whatsappUrl = buildWhatsAppUrl("Ciao! Vorrei informazioni.");

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="font-display text-4xl text-charcoal mb-4">Contatti</h1>
      <p className="text-stone-600 max-w-2xl mb-12">
        Siamo a disposizione per consigli su prodotti, consegne e preventivi personalizzati.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex gap-4">
            <MapPin className="h-6 w-6 text-terracotta shrink-0" />
            <div>
              <h2 className="font-medium text-charcoal">Sede</h2>
              <p className="text-stone-600 mt-1">
                {settings?.address || "Calabria, Italia"}
              </p>
              {settings?.pickupAddress && (
                <p className="text-sm text-stone-500 mt-1">
                  Ritiro: {settings.pickupAddress}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4">
            <Phone className="h-6 w-6 text-terracotta shrink-0" />
            <div>
              <h2 className="font-medium text-charcoal">Telefono</h2>
              <a
                href={`tel:${settings?.storePhone || "+393901234567"}`}
                className="text-stone-600 hover:text-terracotta mt-1 block"
              >
                {settings?.storePhone || "+39 390 123 4567"}
              </a>
            </div>
          </div>
        </div>

        <div className="p-8 bg-stone-50 rounded-xl border border-stone-200">
          <h2 className="font-display text-2xl text-charcoal mb-4">Scrivici</h2>
          <p className="text-stone-600 mb-6">
            Rispondiamo entro 24 ore nei giorni lavorativi.
          </p>
          <Button asChild size="lg" className="w-full sm:w-auto">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              WhatsApp
            </a>
          </Button>
          {settings?.storeEmail && (
            <p className="mt-4 text-sm">
              <Mail className="inline h-4 w-4 mr-2 text-terracotta" />
              <a href={`mailto:${settings.storeEmail}`} className="text-terracotta hover:underline">
                {settings.storeEmail}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
