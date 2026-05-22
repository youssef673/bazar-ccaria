import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await prisma.user.findUnique({
      where: { email: "admin@bazar.ccaria" },
    });

    if (!user) {
      return NextResponse.json({ found: false, error: "User not found" });
    }

    const valid = await bcrypt.compare("changeme123", user.passwordHash ?? "");

    return NextResponse.json({
      found: true,
      email: user.email,
      role: user.role,
      hasPassword: !!user.passwordHash,
      passwordValid: valid,
    });
  } catch (e) {
    return NextResponse.json({ found: false, error: String(e) });
  }
}
