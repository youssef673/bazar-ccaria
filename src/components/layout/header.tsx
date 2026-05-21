"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  MessageCircle,
  UserCircle,
} from "lucide-react";
import { useCart } from "@/store/cart";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { BazarLogo } from "@/components/brand/bazar-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useMounted } from "@/hooks/use-mounted";

const navLinks = [
  { href: "/catalogo", label: "Catalogo" },
  { href: "/galleria", label: "Galleria" },
  { href: "/consegne", label: "Consegne" },
  { href: "/preventivi", label: "Preventivi" },
  { href: "/contatti", label: "Contatti" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const mounted = useMounted();
  const totalItems = useCart((s) => s.totalItems());
  const whatsappUrl = buildWhatsAppUrl("Ciao! Vorrei informazioni sui vostri prodotti.");

  return (
    <header className="sticky top-0 z-50 bg-cream/95 backdrop-blur-md border-b border-stone-200">
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between gap-4">
          <BazarLogo
            variant="horizontal"
            iconSize={72}
            className="hidden sm:block"
          />
          <BazarLogo
            variant="icon"
            iconSize={48}
            className="sm:hidden"
          />

          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname.startsWith(link.href) ? "page" : undefined}
                className={cn(
                  "text-sm font-medium transition-colors",
                  pathname.startsWith(link.href)
                    ? "text-terracotta"
                    : "text-stone-600 hover:text-terracotta"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/catalogo"
              className="hidden sm:flex p-2 text-stone-600 hover:text-terracotta transition-colors"
              aria-label="Cerca"
            >
              <Search className="h-5 w-5" />
            </Link>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-sage hover:text-sage-dark transition-colors"
              aria-label="WhatsApp"
            >
              <MessageCircle className="h-5 w-5" />
            </a>
            <Link
              href="/account"
              className={cn(
                "p-2 transition-colors",
                pathname.startsWith("/account")
                  ? "text-terracotta"
                  : "text-stone-600 hover:text-terracotta"
              )}
              aria-label="Account"
              aria-current={pathname.startsWith("/account") ? "page" : undefined}
            >
              <UserCircle className="h-5 w-5" />
            </Link>
            <Link
              href="/carrello"
              className="relative p-2 text-stone-600 hover:text-terracotta transition-colors"
              aria-label="Carrello"
            >
              <ShoppingBag className="h-5 w-5" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-terracotta text-[10px] font-bold text-white">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>
            <button
              type="button"
              className="lg:hidden p-2 text-stone-600"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Chiudi menu" : "Apri menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <div
        id="mobile-navigation"
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-300 border-t border-stone-200 bg-cream",
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
              className={cn(
                "py-3 text-base font-medium hover:text-terracotta border-b border-stone-100 last:border-0",
                pathname.startsWith(link.href)
                  ? "text-terracotta"
                  : "text-charcoal"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/account"
            aria-current={pathname.startsWith("/account") ? "page" : undefined}
            className={cn(
              "py-3 text-base font-medium hover:text-terracotta border-b border-stone-100",
              pathname.startsWith("/account")
                ? "text-terracotta"
                : "text-charcoal"
            )}
            onClick={() => setMobileOpen(false)}
          >
            Account
          </Link>
          <Button asChild className="mt-2">
            <Link href="/catalogo" onClick={() => setMobileOpen(false)}>
              Sfoglia il catalogo
            </Link>
          </Button>
        </nav>
      </div>
    </header>
  );
}
