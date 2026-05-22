import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL;
  const cwd = process.cwd();
  const tmpDir = "/tmp";

  const checks = {
    dbUrl,
    cwd,
    tmpExists: fs.existsSync(tmpDir),
    prismaDir: path.resolve(cwd, "prisma"),
    prismaDirExists: fs.existsSync(path.resolve(cwd, "prisma")),
    devDbPath: path.resolve(cwd, "prisma", "dev.db"),
    devDbExists: fs.existsSync(path.resolve(cwd, "prisma", "dev.db")),
    tmpDbPath: path.resolve(tmpDir, "dev.db"),
    tmpDbExists: fs.existsSync(path.resolve(tmpDir, "dev.db")),
  };

  let userCount = -1;
  let productCount = -1;
  let categoryCount = -1;
  let error = null;

  try {
    const [u, p, c] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.category.count(),
    ]);
    userCount = u;
    productCount = p;
    categoryCount = c;
  } catch (e) {
    error = String(e);
  }

  return NextResponse.json({ checks, userCount, productCount, categoryCount, error });
}
