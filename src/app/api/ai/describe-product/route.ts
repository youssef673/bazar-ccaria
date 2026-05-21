import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";
import { generateProductDescriptionFromImage } from "@/lib/ai";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("image") as File | null;
    const priceValue = form.get("price") as string;

    if (!file) {
      return NextResponse.json({ error: "Nessuna immagine inviata." }, { status: 400 });
    }

    const price = Number(priceValue);
    if (!price || price <= 0) {
      return NextResponse.json({ error: "Prezzo non valido." }, { status: 400 });
    }

    const { url } = await saveUploadedFile(file, "ai");
    const host = req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") || "http";
    const origin = host ? `${proto}://${host}` : "http://localhost:3000";
    const imageUrl = new URL(url, origin).toString();

    const description = await generateProductDescriptionFromImage(imageUrl, price);
    return NextResponse.json(description);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore generico" },
      { status: 500 }
    );
  }
}
