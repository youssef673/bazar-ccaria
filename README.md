# Bazar

E-commerce artigianale Next.js per vasi in ceramica, statue in cemento, fontane e arredo da giardino. Consegna in Calabria.

## Requisiti

- Node.js 20+
- PostgreSQL
- Account Stripe (opzionale, per pagamenti con carta)

## Installazione

1. Clona il repository e installa le dipendenze:

```bash
npm install
```

2. Copia le variabili d'ambiente:

```bash
cp .env.example .env
```

3. Configura `DATABASE_URL`, `AUTH_SECRET` e le chiavi Stripe in `.env`.

4. Inizializza il database e il seed:

```bash
npm run db:push
npm run db:seed
```

5. Avvia il server di sviluppo:

```bash
npm run dev
```

Il sito sarà disponibile su [http://localhost:3000](http://localhost:3000).

## Admin

- URL: `/admin/login`
- Credenziali predefinite (dopo il seed): vedi `ADMIN_EMAIL` e `ADMIN_PASSWORD` in `.env`
- Generazione descrizioni AI: `/admin/ai`
- Aggiungi prodotti dal pannello: `/admin/products/new`

> Nota: la generazione immagini usa un servizio esterno, quindi l'URL dell'immagine deve essere raggiungibile dall'API OpenAI. In sviluppo locale questo può richiedere un tunnel pubblico.

## Pubblica su GitHub

1. Inizializza il repository (se non lo hai già fatto):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Crea un repository su GitHub.
3. Aggiungi il remote e invia il codice:
   ```bash
   git remote add origin https://github.com/<tuo-utente>/<nome-repo>.git
   git branch -M main
   git push -u origin main
   ```
4. Se vuoi pubblicare il sito, collega il repository GitHub a Vercel.

## Script utili

| Comando | Descrizione |
|---------|-------------|
| `npm run dev` | Sviluppo |
| `npm run build` | Build produzione |
| `npm run db:seed` | Popola categorie, prodotti, galleria e admin |
| `npm run db:studio` | Prisma Studio |

## Struttura principale

- `src/app/` — Pagine (catalogo, carrello, checkout, admin)
- `src/app/api/` — API REST (ordini, preventivi, recensioni, Stripe)
- `src/lib/` — Logica condivisa (Calabria, spedizioni, auth)
- `prisma/` — Schema database e seed

## Consegne

Il negozio serve esclusivamente la Calabria. Per prodotti pesanti (>30 kg) è richiesto un preventivo personalizzato.

## Stripe Webhook

In sviluppo, usa Stripe CLI:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Imposta `STRIPE_WEBHOOK_SECRET` con il valore fornito dal CLI.

## Licenza

Progetto privato — Bazar.
