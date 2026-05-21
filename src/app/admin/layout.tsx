import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { BazarLogo } from "@/components/brand/bazar-logo";
import { LayoutDashboard, Package, ShoppingCart, FileText, LogOut } from "lucide-react";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/orders", label: "Ordini", icon: ShoppingCart },
  { href: "/admin/products", label: "Prodotti", icon: Package },
  { href: "/admin/ai", label: "AI Descrizioni", icon: FileText },
  { href: "/admin/quotes", label: "Preventivi", icon: FileText },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-stone-100 flex">
      <aside className="w-64 bg-charcoal text-stone-300 shrink-0 hidden md:flex flex-col">
        <div className="p-6 border-b border-stone-700 space-y-2">
          <BazarLogo variant="icon" iconSize={36} href="/" />
          <p className="text-xs text-stone-500 uppercase tracking-wider">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {nav.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-stone-800 text-sm"
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-stone-700">
          <Link href="/" className="text-xs text-stone-500 hover:text-cream">
            Torna al sito
          </Link>
        </div>
      </aside>
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white border-b border-stone-200 px-6 py-4 flex justify-between items-center">
          <span className="text-sm text-stone-600">{session.user?.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/admin/login" });
            }}
          >
            <button type="submit" className="flex items-center gap-2 text-sm text-stone-600 hover:text-terracotta">
              <LogOut className="h-4 w-4" />
              Esci
            </button>
          </form>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
