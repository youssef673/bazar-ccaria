# Deploy produzione

## Stato consigliato

- Codice: GitHub pubblico `youssef673/bazar-ccaria`
- Hosting: Vercel collegato al repository GitHub
- Database produzione: Postgres gestito, per esempio Neon o Supabase
- Upload reali: storage persistente, per esempio S3/R2/Supabase Storage

## Variabili da impostare su Vercel

Minime:

```bash
DATABASE_URL="postgresql://..."
AUTH_SECRET="genera-un-secret-lungo"
NEXTAUTH_URL="https://tuo-dominio.it"
NEXT_PUBLIC_SITE_URL="https://tuo-dominio.it"
NEXT_PUBLIC_WHATSAPP="393901234567"
ADMIN_EMAIL="..."
ADMIN_PASSWORD="..."
```

Pagamenti:

```bash
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

Notifiche:

```bash
ADMIN_NOTIFICATION_EMAIL="info@bazar.ccaria"
NOTIFICATION_WEBHOOK_URL="https://..."
```

## Prima di accettare ordini veri

1. Usa un database Postgres persistente, non SQLite.
2. Cambia password admin e `AUTH_SECRET`.
3. Configura Stripe live e webhook `/api/stripe/webhook`.
4. Carica foto reali dei prodotti dal pannello admin.
5. Verifica ordine, preventivo, recensione e upload in produzione.

## Comandi utili

```bash
npm run check:env
npm run build
npm run db:push
npm run db:seed
```

## Nota SQLite

SQLite va bene in locale. Su hosting serverless non e' adatto a ordini reali:
i file non sono persistenti in modo affidabile e le scritture possono fallire.
Per questo il sito e' pronto per il deploy, ma il deploy stabile richiede un
`DATABASE_URL` Postgres reale.
