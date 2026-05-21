import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";

const UPLOAD_DIR = process.env.UPLOAD_DIR || "./public/uploads";
const MAX_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const EXTENSIONS_BY_TYPE: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

function safeSubfolder(input: string) {
  const cleaned = input.toLowerCase().replace(/[^a-z0-9/_-]/g, "");
  if (!cleaned || cleaned.includes("..") || cleaned.startsWith("/")) {
    return "general";
  }
  return cleaned;
}

export async function saveUploadedFile(
  file: File,
  subfolder = "general"
): Promise<{ url: string; filename: string }> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Formato file non supportato. Usa JPEG, PNG o WebP.");
  }
  if (file.size > MAX_SIZE) {
    throw new Error("File troppo grande. Massimo 5MB.");
  }

  const ext = EXTENSIONS_BY_TYPE[file.type] || "jpg";
  const filename = `${randomUUID()}.${ext}`;
  const dir = path.join(process.cwd(), UPLOAD_DIR, safeSubfolder(subfolder));
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  const filepath = path.join(dir, filename);
  await writeFile(filepath, buffer);

  const url = `/uploads/${safeSubfolder(subfolder)}/${filename}`;
  return { url, filename };
}
