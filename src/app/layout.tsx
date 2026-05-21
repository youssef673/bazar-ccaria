import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartProvider } from "@/components/providers/cart-provider";
import { AuthSessionProvider } from "@/components/providers/session-provider";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  ),
  applicationName: BRAND.name,
  title: {
    default: `${BRAND.name} | Vasi, Statue e Arredo per il Giardino`,
    template: `%s | ${BRAND.shortName}`,
  },
  description:
    "bazar.ccaria - vasi in ceramica, statue in cemento, fontane da giardino e arredo per esterni. Artigianato premium, consegna in Calabria.",
  keywords: [
    "bazar.ccaria",
    "vasi ceramica",
    "statue cemento",
    "fontane giardino",
    "arredo giardino",
    "decorazioni esterno",
    "Calabria",
  ],
  authors: [{ name: BRAND.name }],
  creator: BRAND.name,
  publisher: BRAND.name,
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/logo/bazar-icon.png",
    shortcut: "/logo/bazar-icon.png",
    apple: "/logo/bazar-icon.png",
  },
  manifest: "/manifest.webmanifest",
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: BRAND.name,
    title: BRAND.name,
    description:
      "Vasi, statue, fontane e arredo giardino artigianale con consegna in Calabria.",
    url: "/",
    images: [
      {
        url: "/logo/bazar-logo-horizontal.png",
        width: 1536,
        height: 1024,
        alt: BRAND.name,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: BRAND.name,
    description:
      "Artigianato premium per giardini, terrazzi e spazi esterni in Calabria.",
    images: ["/logo/bazar-logo-horizontal.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it" className={poppins.variable}>
      <body className="font-sans min-h-screen flex flex-col">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-charcoal focus:px-4 focus:py-2 focus:text-sm focus:text-cream"
        >
          Vai al contenuto
        </a>
        <AuthSessionProvider>
          <CartProvider>
            <Header />
            <main id="main-content" className="flex-1" tabIndex={-1}>
              {children}
            </main>
            <Footer />
          </CartProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
