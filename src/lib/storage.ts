import "server-only";
import { mkdir, writeFile, unlink } from "fs/promises";
import path from "path";

// Deliberately outside /public: Next.js snapshots the public/ directory at
// server startup, so files written there at runtime (i.e. every admin
// upload) 404 until the server restarts. Files here are served on demand by
// the route handler at src/app/uploads/[...path]/route.ts instead.
export const UPLOAD_ROOT = path.join(process.cwd(), "storage", "uploads");

const MAX_PHOTO_BYTES = 15 * 1024 * 1024; // 15MB
const MAX_VIDEO_BYTES = 300 * 1024 * 1024; // 300MB

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];

function sanitizeFilename(name: string) {
  return name
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .toLowerCase();
}

export async function saveUploadedFile(file: File, subdir: string): Promise<string> {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);

  if (!isImage && !isVideo) {
    throw new Error(`Type de fichier non supporté : ${file.type || "inconnu"}`);
  }
  const maxBytes = isImage ? MAX_PHOTO_BYTES : MAX_VIDEO_BYTES;
  if (file.size > maxBytes) {
    throw new Error(
      `Fichier trop volumineux (${Math.round(file.size / 1024 / 1024)}MB, max ${Math.round(maxBytes / 1024 / 1024)}MB).`
    );
  }

  const dir = path.join(UPLOAD_ROOT, subdir);
  await mkdir(dir, { recursive: true });

  const unique = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${unique}-${sanitizeFilename(file.name)}`;
  const filePath = path.join(dir, filename);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  return `/uploads/${subdir}/${filename}`;
}

export async function deleteUploadedFile(publicUrl: string) {
  if (!publicUrl.startsWith("/uploads/")) return;
  const filePath = path.join(UPLOAD_ROOT, publicUrl.replace(/^\/uploads\//, ""));
  try {
    await unlink(filePath);
  } catch {
    // fichier déjà absent — pas bloquant
  }
}
