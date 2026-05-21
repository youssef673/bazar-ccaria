import Link from "next/link";
import type { Metadata } from "next";
import {
  ClipboardList,
  FileText,
  Mail,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_STATUS_LABELS,
  QUOTE_STATUS_LABELS,
} from "@/lib/constants";
import { Button } from "@/components/ui/button";
import {
  AccountActions,
  AdminAccessButton,
} from "@/components/account/account-actions";
import { AccountCartSummary } from "@/components/account/account-cart-summary";
import { ProfileForm } from "@/components/account/profile-form";
import { TrustPanel } from "@/components/commerce/trust-panel";

export const metadata: Metadata = {
  title: "Account",
  description: "Profilo, carrello, ordini e richieste preventivo bazar.ccaria",
};

async function getAccountData(userId?: string, email?: string | null) {
  if (!userId && !email) return { orders: [], quotes: [] };

  const [orders, quotes] = await Promise.all([
    prisma.order.findMany({
      where: {
        OR: [
          ...(userId ? [{ userId }] : []),
          ...(email ? [{ customerEmail: email }] : []),
        ],
      },
      include: { items: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
    prisma.quote.findMany({
      where: email ? { customerEmail: email } : { id: "__none__" },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]);

  return { orders, quotes };
}

export default async function AccountPage() {
  const session = await auth();
  const user = session?.user;
  const isSignedIn = Boolean(user);
  const { orders, quotes } = await getAccountData(user?.id, user?.email);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-terracotta">
            Area personale
          </p>
          <h1 className="mt-3 font-display text-4xl text-charcoal md:text-5xl">
            Account
          </h1>
          <p className="mt-3 max-w-2xl text-stone-600">
            Gestisci profilo, carrello, ordini e richieste preventivo in un
            unico posto.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AccountActions isSignedIn={isSignedIn} />
          {user?.role === "ADMIN" && (
            <Button asChild variant="sage">
              <Link href="/admin">
                <ShieldCheck className="h-4 w-4" />
                Pannello admin
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-lg border border-stone-200 bg-white p-6 lg:col-span-1">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
              <UserCircle className="h-7 w-7" />
            </div>
            <div>
              <h2 className="font-display text-2xl text-charcoal">
                {isSignedIn ? user?.name || "Profilo" : "Ospite"}
              </h2>
              <p className="mt-1 text-sm text-stone-600">
                {isSignedIn
                  ? user?.email
                  : "Puoi usare catalogo, carrello, preventivi e assistenza senza registrazione."}
              </p>
              {user?.role && (
                <span className="mt-3 inline-flex rounded-full bg-sage/10 px-3 py-1 text-xs font-semibold text-sage-dark">
                  {user.role}
                </span>
              )}
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-stone-500">Ordini</p>
              <p className="mt-1 text-xl font-semibold text-charcoal">
                {orders.length}
              </p>
            </div>
            <div className="rounded-md bg-stone-50 p-3">
              <p className="text-stone-500">Preventivi</p>
              <p className="mt-1 text-xl font-semibold text-charcoal">
                {quotes.length}
              </p>
            </div>
          </div>
        </section>

        <div className="space-y-6 lg:col-span-2">
          {isSignedIn ? (
            <ProfileForm name={user?.name} email={user?.email} />
          ) : (
            <section className="rounded-lg border border-stone-200 bg-stone-50 p-6">
              <h2 className="font-display text-2xl text-charcoal">
                Acquisto senza registrazione
              </h2>
              <p className="mt-2 text-sm text-stone-600">
                Per i clienti teniamo il percorso semplice: scegli i prodotti,
                invia ordine o preventivo e ricevi aggiornamenti via email e
                WhatsApp. L&apos;accesso con password resta riservato allo staff.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <Button asChild>
                  <Link href="/catalogo">Sfoglia prodotti</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/preventivi">Richiedi preventivo</Link>
                </Button>
                <AdminAccessButton />
              </div>
            </section>
          )}

          <AccountCartSummary />
        </div>
      </div>

      <section className="mt-6 rounded-lg border border-stone-200 bg-white p-6">
        <div className="mb-5 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta/10 text-terracotta">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-2xl text-charcoal">
              Cosa puoi fare da qui
            </h2>
            <p className="text-sm text-stone-600">
              Controlla il carrello, riprendi un preventivo e trova subito i
              canali rapidi per assistenza.
            </p>
          </div>
        </div>
        <TrustPanel compact />
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-charcoal">Ordini</h2>
              <p className="mt-1 text-sm text-stone-600">
                Ultimi ordini associati alla tua email.
              </p>
            </div>
            <PackageCheck className="h-6 w-6 text-terracotta" />
          </div>

          {orders.length === 0 ? (
            <EmptyState
              icon={<ClipboardList className="h-5 w-5" />}
              title="Nessun ordine trovato"
              text="Quando completi un ordine con questa email, lo vedrai qui."
              href="/catalogo"
              action="Vai al catalogo"
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {orders.map((order) => (
                <div key={order.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-charcoal">
                        {order.orderNumber}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {order.items.length} articoli ·{" "}
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {PAYMENT_STATUS_LABELS[order.paymentStatus] ||
                          order.paymentStatus}
                      </p>
                    </div>
                    <p className="font-semibold text-terracotta">
                      {formatPrice(order.total)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-stone-200 bg-white p-6">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl text-charcoal">Preventivi</h2>
              <p className="mt-1 text-sm text-stone-600">
                Richieste inviate per consegne speciali o prodotti pesanti.
              </p>
            </div>
            <FileText className="h-6 w-6 text-terracotta" />
          </div>

          {quotes.length === 0 ? (
            <EmptyState
              icon={<Mail className="h-5 w-5" />}
              title="Nessuna richiesta"
              text="Invia un preventivo per prodotti pesanti o consegne particolari."
              href="/preventivi"
              action="Nuovo preventivo"
            />
          ) : (
            <div className="divide-y divide-stone-100">
              {quotes.map((quote) => (
                <div key={quote.id} className="py-4 first:pt-0 last:pb-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-medium text-charcoal">
                        {quote.quoteNumber}
                      </p>
                      <p className="mt-1 text-xs text-stone-500">
                        {quote.city}, {quote.province} ·{" "}
                        {QUOTE_STATUS_LABELS[quote.status] || quote.status}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-charcoal">
                      {quote.quotedAmount
                        ? formatPrice(quote.quotedAmount)
                        : "In valutazione"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function EmptyState({
  icon,
  title,
  text,
  href,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
  href: string;
  action: string;
}) {
  return (
    <div className="rounded-lg bg-stone-50 p-5 text-sm">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-white text-terracotta">
        {icon}
      </div>
      <p className="font-medium text-charcoal">{title}</p>
      <p className="mt-1 text-stone-600">{text}</p>
      <Button asChild variant="outline" size="sm" className="mt-4">
        <Link href={href}>{action}</Link>
      </Button>
    </div>
  );
}
