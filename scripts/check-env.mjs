import { existsSync, readFileSync } from "node:fs";

if (existsSync(".env")) {
  const envFile = readFileSync(".env", "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    if (process.env[key]) continue;
    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  }
}

const required = [
  "DATABASE_URL",
  "AUTH_SECRET",
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_WHATSAPP",
];

const recommendedForProduction = [
  "ADMIN_EMAIL",
  "ADMIN_PASSWORD",
  "ADMIN_NOTIFICATION_EMAIL",
  "STRIPE_SECRET_KEY",
  "STRIPE_PUBLISHABLE_KEY",
  "STRIPE_WEBHOOK_SECRET",
];

const missing = required.filter((key) => !process.env[key]);
const missingRecommended = recommendedForProduction.filter(
  (key) => !process.env[key]
);

if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
  process.exit(1);
}

if (missingRecommended.length > 0) {
  console.warn(
    `Recommended production env vars not set: ${missingRecommended.join(", ")}`
  );
}

if (
  process.env.NODE_ENV === "production" &&
  process.env.DATABASE_URL?.startsWith("file:")
) {
  console.warn(
    "Production is using SQLite. Use Postgres/Neon/Supabase before accepting real orders."
  );
}

console.log("Environment check passed.");
