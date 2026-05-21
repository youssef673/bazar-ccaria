import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { notifyAdmin } from "@/lib/notifications";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  try {
    const rateLimit = checkRateLimit(req, "reviews", 4, 60_000);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: "Troppi tentativi. Riprova tra poco." },
        { status: 429 }
      );
    }

    const form = await req.formData();
    const productId = form.get("productId") as string;
    const rating = parseInt(form.get("rating") as string, 10);
    const comment = form.get("comment") as string;
    const authorName = form.get("authorName") as string;
    const title = (form.get("title") as string) || null;
    const authorEmail = (form.get("authorEmail") as string) || null;

    if (!productId || !comment || !authorName || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Dati mancanti" }, { status: 400 });
    }

    const review = await prisma.review.create({
      data: {
        productId,
        rating,
        comment,
        authorName,
        title,
        authorEmail,
        approved: false,
      },
    });

    const files = form.getAll("images") as File[];
    for (const file of files) {
      if (file.size > 0) {
        const { url } = await saveUploadedFile(file, "reviews");
        await prisma.reviewImage.create({
          data: { reviewId: review.id, url },
        });
      }
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    await notifyAdmin("review", {
      title: "Nuova recensione da approvare",
      message: `${authorName} ha inviato una recensione da ${rating}/5.`,
      url: `${siteUrl}/admin`,
      metadata: {
        reviewId: review.id,
        productId,
        authorEmail,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  const pending = req.nextUrl.searchParams.get("pending") === "1";
  const reviews = await prisma.review.findMany({
    where: pending ? { approved: false } : undefined,
    include: { product: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(reviews);
}

export async function PATCH(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }
  const { id, approved } = await req.json();
  const review = await prisma.review.update({
    where: { id },
    data: { approved },
  });
  return NextResponse.json(review);
}
