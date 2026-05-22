import { PrismaClient } from "@prisma/client";
import path from "path";

let databaseUrl = process.env.DATABASE_URL;
if (
  process.env.NODE_ENV === "production" &&
  databaseUrl?.startsWith("file:") &&
  !path.isAbsolute(databaseUrl.replace("file:", ""))
) {
  const relativePath = databaseUrl.replace("file:", "");
  const dbPath = path.resolve(process.cwd(), relativePath);
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
