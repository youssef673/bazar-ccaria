import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { generateQuoteNumber } from "@/lib/utils";
import { z } from "zod";
import { QuoteStatus } from "@prisma/client";

const quoteItemSchema = z.object({
  productId: z.string().min(1),
  name: z.string().min(1),
  quantity: z.number().int().positive(),
  price: z.number().nonnegative(),
  weight: z.number().nullable().optional(),
});

const quoteSchema = z.object({
  customerName: z.string().trim().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().trim().min(8),
  city: z.string().trim().min(2),
  province: z.string().trim().min(1),
  cap: z.string().trim().optional(),
  address: z.string().trim().optional(),
  message: z.string().trim().optional(),
  items: z.array(quoteItemSchema).optional(),
  totalWeight: z.number().nonnegative().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const data = quoteSchema.parse(await req.json());
    const items = (data.items ?? []).map((item) => ({
      productId: item.productId,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      weight: item.weight ?? null,
    }));

    const quote = await prisma.quote.create({
      data: {
        quoteNumber: generateQuoteNumber(),
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        city: data.city,
        province: data.province,
        cap: data.cap,
        address: data.address,
        message: data.message,
        totalWeight: data.totalWeight ?? 0,
        items,
      },
    });
    return NextResponse.json({ quoteNumber: quote.quoteNumber });
  } catch {
    return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
  }
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  const quotes = await prisma.quote.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(quotes);
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
    }
    const patchSchema = z.object({
      id: z.string().min(1),
      status: z.nativeEnum(QuoteStatus).optional(),
      quotedAmount: z.number().nonnegative().nullable().optional(),
      adminNotes: z.string().trim().optional(),
    });
    const { id, status, quotedAmount, adminNotes } = patchSchema.parse(
      await req.json()
    );
    const quote = await prisma.quote.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(quotedAmount != null && { quotedAmount }),
        ...(adminNotes && { adminNotes }),
      },
    });
    return NextResponse.json(quote);
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Dati non validi" }, { status: 400 });
    }
    return NextResponse.json({ error: "Errore server" }, { status: 500 });
  }
}
