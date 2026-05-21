import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { saveUploadedFile } from "@/lib/upload";
import { slugify } from "@/lib/utils";
import type { ProductStatus } from "@prisma/client";

const VALID_STATUSES = ["AVAILABLE", "PREORDER", "ON_ORDER", "OUT_OF_STOCK"];

export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Non autorizzato" }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const name = (form.get("name")?.toString() || "").trim();
    const slugInput = (form.get("slug")?.toString() || "").trim();
    const categoryId = (form.get("categoryId")?.toString() || "").trim();
    const description = (form.get("description")?.toString() || "").trim();
    const shortDescription = (form.get("shortDescription")?.toString() || "").trim() || null;
    const statusInput = (form.get("status")?.toString() || "AVAILABLE").trim();
    const price = Number(form.get("price")?.toString() || "0");
    const compareAtPrice = Number(form.get("compareAtPrice")?.toString() || "0");
    const stock = Number(form.get("stock")?.toString() || "0");
    const material = (form.get("material")?.toString() || "").trim() || null;
    const dimensions = (form.get("dimensions")?.toString() || "").trim() || null;
    const weight = Number(form.get("weight")?.toString() || "0");
    const productionDays = Number(form.get("productionDays")?.toString() || "0");
    const preorderDepositPct = Number(form.get("preorderDepositPct")?.toString() || "30");
    const isHeavy = form.get("isHeavy") === "on";
    const allowPreorder = form.get("allowPreorder") === "on";
    const image = form.get("image") as File | null;
    const images = form.getAll("images") as File[];

    if (!name) {
      return NextResponse.json({ error: "Nome prodotto obbligatorio." }, { status: 400 });
    }
    if (!description) {
      return NextResponse.json({ error: "Descrizione obbligatoria." }, { status: 400 });
    }
    if (!categoryId) {
      return NextResponse.json({ error: "Categoria obbligatoria." }, { status: 400 });
    }
    if (!price || price <= 0) {
      return NextResponse.json({ error: "Prezzo non valido." }, { status: 400 });
    }

    let slug = slugInput || slugify(name);
    if (!slug) {
      return NextResponse.json({ error: "Slug non valido." }, { status: 400 });
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Math.random().toString(36).slice(2, 6)}`;
    }

    const validStatus = VALID_STATUSES.includes(statusInput) ? statusInput : "AVAILABLE";

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        shortDescription,
        price,
        compareAtPrice: compareAtPrice > 0 ? compareAtPrice : null,
        status: validStatus as ProductStatus,
        material,
        dimensions,
        weight: weight > 0 ? weight : null,
        isHeavy: isHeavy || weight >= 30,
        stock: stock >= 0 ? stock : 0,
        allowPreorder,
        preorderDepositPct: allowPreorder ? preorderDepositPct : null,
        productionDays: productionDays > 0 ? productionDays : null,
        categoryId,
      },
    });

    const uploadFiles = [
      ...(image && image.size > 0 ? [image] : []),
      ...images.filter((file) => file.size > 0),
    ].slice(0, 6);

    for (const [sortOrder, file] of uploadFiles.entries()) {
      const { url } = await saveUploadedFile(file, "products");
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url,
          alt: `${name} - foto ${sortOrder + 1}`,
          sortOrder,
        },
      });
    }

    return NextResponse.json({ ok: true, product: { id: product.id, slug: product.slug } });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Errore durante la creazione del prodotto." },
      { status: 500 }
    );
  }
}
