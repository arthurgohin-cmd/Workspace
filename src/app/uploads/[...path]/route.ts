import { stat } from "fs/promises";
import { createReadStream } from "fs";
import { Readable } from "stream";
import path from "path";
import { NextRequest } from "next/server";
import { UPLOAD_ROOT } from "@/lib/storage";

const CONTENT_TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".mp4": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  // Guard against path traversal — every segment must be a plain filename/dirname.
  if (segments.some((s) => s.includes("..") || s.includes("/") || s.includes("\\"))) {
    return new Response("Not found", { status: 404 });
  }

  const filePath = path.join(UPLOAD_ROOT, ...segments);
  const ext = path.extname(filePath).toLowerCase();
  const contentType = CONTENT_TYPES[ext];
  if (!contentType) {
    return new Response("Not found", { status: 404 });
  }

  let stats;
  try {
    stats = await stat(filePath);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const range = request.headers.get("range");
  const baseHeaders = {
    "Content-Type": contentType,
    "Cache-Control": "public, max-age=31536000, immutable",
    "Accept-Ranges": "bytes",
  };

  if (range) {
    const match = /bytes=(\d*)-(\d*)/.exec(range);
    const start = match?.[1] ? parseInt(match[1], 10) : 0;
    const end = match?.[2] ? parseInt(match[2], 10) : stats.size - 1;
    const chunkSize = end - start + 1;

    const stream = createReadStream(filePath, { start, end });
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      status: 206,
      headers: {
        ...baseHeaders,
        "Content-Range": `bytes ${start}-${end}/${stats.size}`,
        "Content-Length": String(chunkSize),
      },
    });
  }

  const stream = createReadStream(filePath);
  return new Response(Readable.toWeb(stream) as ReadableStream, {
    headers: { ...baseHeaders, "Content-Length": String(stats.size) },
  });
}
