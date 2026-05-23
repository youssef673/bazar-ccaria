import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

let databaseUrl = process.env.DATABASE_URL;
if (
  process.env.NODE_ENV === "production" &&
  databaseUrl?.startsWith("file:")
) {
  const relativePath = databaseUrl.replace("file:", "");
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const candidates = [
    path.resolve(process.cwd(), relativePath),
    path.resolve(__dirname, "..", "..", relativePath),
    path.resolve("/vercel/path0", relativePath),
  ];
  let dbPath = candidates[0];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) {
      dbPath = candidate;
      break;
    }
  }

  // Copia il DB in /tmp dove il filesystem è scrivibile su Vercel
  const tmpDb = path.resolve("/tmp", path.basename(dbPath));
  if (fs.existsSync(dbPath)) {
    try {
      fs.copyFileSync(dbPath, tmpDb);
    } catch {
      // se la copia fallisce, usa il path originale
    }
  }
  if (fs.existsSync(tmpDb)) {
    dbPath = tmpDb;
  }

  databaseUrl = `file:${dbPath}`;
  process.env.DATABASE_URL = databaseUrl;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
