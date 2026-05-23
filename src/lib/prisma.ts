import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

const TMP_DB = "/tmp/dev.db";

function ensureDb(): string {
  // Se già in /tmp, usalo direttamente
  if (fs.existsSync(TMP_DB)) return TMP_DB;

  // Possibili sorgenti del DB (in ordine di priorità)
  const sources = [
    path.join(process.cwd(), "prisma", "dev.db"),
    "/vercel/path0/prisma/dev.db",
    path.join(__dirname, "..", "..", "prisma", "dev.db"),
  ];

  for (const src of sources) {
    if (fs.existsSync(src)) {
      try {
        fs.copyFileSync(src, TMP_DB);
        return TMP_DB;
      } catch {
        return src;
      }
    }
  }

  return sources[0];
}

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const dbPath = ensureDb();
    return `file:${dbPath}`;
  }
  return url;
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

if (!globalForPrisma.prisma) {
  const dbUrl = getDatabaseUrl();
  process.env.DATABASE_URL = dbUrl;
  globalForPrisma.prisma = new PrismaClient({
    datasources: { db: { url: dbUrl } },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma!;
