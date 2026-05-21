import Link from "next/link";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { BazarLogo } from "@/components/brand/bazar-logo";
import { BRAND } from "@/lib/brand";

const footerLinks = {
  shop: [
    { href: "/catalogo", label: "Catalogo" },
    { href: "/catalogo/vasi-ceramica", label: "Vasi in Ceramica" },
    { href: "/catalogo/statue-cemento", label: "Statue in Cemento" },
    { href: "/catalogo/fontane-giardino", label: "Fontane" },
    { href: "/catalogo/arredo-giardino", label: "Arredo Giardino" },
  ],
  info: [
    { href: "/consegne", label: "Consegne" },
    { href: "/preventivi", label: "Preventivi" },
    { href: "/galleria", label: "Galleria Lavori" },
    { href: "/contatti", label: "Contatti" },
    { href: "/account", label: "Account" },
  ],
};

export function Footer() {
  const whatsappUrl = buildWhatsAppUrl("Ciao! Vorrei informazioni.");

  return (
    <footer className="bg-charcoal text-stone-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <BazarLogo variant="horizontal" theme="dark" iconSize={48} href="/" className="mb-4" />
            <p className="text-sm leading-relaxed mb-6">
              Artigianato e arredo per il tuo giardino. Vasi in ceramica, statue,
              fontane e decorazioni da esterno — consegniamo in tutta la Calabria.
            </p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sage-light hover:text-white transition-colors"
            >
              <MessageCircle className="h-5 w-5" />
              Scrivici su WhatsApp
            </a>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Negozio</h4>
            <ul className="space-y-2">
              {footerLinks.shop.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-terracotta-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Informazioni</h4>
            <ul className="space-y-2">
              {footerLinks.info.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-terracotta-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-cream mb-4">Contatti</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-terracotta-light" />
                <span>Calabria, Italia — Consegna locale</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-terracotta-light" />
                <a href="tel:+393901234567" className="hover:text-white">
                  +39 390 123 4567
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-terracotta-light" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-white">
                  {BRAND.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-stone-700 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} {BRAND.name}. Tutti i diritti riservati.</p>
          <p>Consegna esclusiva in Calabria</p>
        </div>
      </div>
    </footer>
  );
}
