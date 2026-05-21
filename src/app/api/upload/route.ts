import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { saveUploadedFile } from "@/lib/upload";

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const subfolder = (form.get("subfolder") as string) || "admin";

    if (!file) {
      return NextResponse.json({ error: "Nessun file" }, { status: 400 });
    }

    const result = await saveUploadedFile(file, subfolder);
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Errore upload" },
      { status: 500 }
    );
  }
}
