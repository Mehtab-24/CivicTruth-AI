import sharp from "sharp";
import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 Megabytes

export interface ImageOptimizationResult {
  mimeType: string;
  data: string; // Base64 string without data URI prefix
  dataUri: string;
  sizeBytes: number;
}

/**
 * Validates that an uploaded file does not exceed the 5MB upload size ceiling.
 */
export function validateFileSize(
  file: File | Blob,
  fieldName = "image",
  maxBytes = MAX_IMAGE_SIZE_BYTES
): { valid: boolean; response?: NextResponse } {
  if (file.size > maxBytes) {
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    logger.warn("Payload ceiling breached", { fieldName, sizeMb, maxBytes });

    const response = NextResponse.json(
      {
        success: false,
        error: {
          code: "PAYLOAD_TOO_LARGE",
          message: `The '${fieldName}' payload (${sizeMb}MB) exceeds the maximum allowed limit of 5MB.`,
          maxAllowedBytes: maxBytes,
        },
      },
      { status: 413 }
    );

    return { valid: false, response };
  }

  return { valid: true };
}

/**
 * Normalizes and compresses an image buffer using Sharp:
 * - Automatically rotates orientation based on EXIF
 * - Resizes max dimensions to 1600x1600 (without enlargement)
 * - Encodes as progressive JPEG at 85% quality
 * - Strips unnecessary metadata to reduce base64 size and token consumption
 */
export async function optimizeImageBuffer(
  inputBuffer: Buffer,
  mimeType = "image/jpeg"
): Promise<ImageOptimizationResult> {
  // Pass through SVG directly to avoid rasterization artifacts
  if (mimeType.includes("svg") || inputBuffer.toString("utf8", 0, 100).includes("<svg")) {
    const base64 = inputBuffer.toString("base64");
    return {
      mimeType: "image/svg+xml",
      data: base64,
      dataUri: `data:image/svg+xml;base64,${base64}`,
      sizeBytes: inputBuffer.length,
    };
  }

  try {
    const optimizedBuffer = await sharp(inputBuffer)
      .rotate() // Auto-orient based on EXIF orientation tag
      .resize({
        width: 1600,
        height: 1600,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 85,
        progressive: true,
        mozjpeg: true,
      })
      .toBuffer();

    const base64 = optimizedBuffer.toString("base64");

    return {
      mimeType: "image/jpeg",
      data: base64,
      dataUri: `data:image/jpeg;base64,${base64}`,
      sizeBytes: optimizedBuffer.length,
    };
  } catch (err) {
    logger.warn("Sharp image optimization fallback to raw buffer", { error: err });
    const fallbackBase64 = inputBuffer.toString("base64");
    return {
      mimeType,
      data: fallbackBase64,
      dataUri: `data:${mimeType};base64,${fallbackBase64}`,
      sizeBytes: inputBuffer.length,
    };
  }
}

/**
 * Optimizes an existing data URI or base64 string.
 */
export async function optimizeBase64OrDataUri(source: string): Promise<ImageOptimizationResult> {
  if (source.startsWith("data:image/svg+xml")) {
    const dataPart = source.replace(/^data:image\/svg\+xml;?(?:utf8|base64)?,/, "");
    const base64 = source.includes(";base64,")
      ? dataPart
      : Buffer.from(decodeURIComponent(dataPart)).toString("base64");
    return {
      mimeType: "image/svg+xml",
      data: base64,
      dataUri: source,
      sizeBytes: Buffer.byteLength(base64, "base64"),
    };
  }

  const match = source.match(/^data:([^;]+);base64,(.+)$/);
  if (match) {
    const mime = match[1];
    const rawBuffer = Buffer.from(match[2], "base64");
    return optimizeImageBuffer(rawBuffer, mime);
  }

  // Raw base64 string
  const rawBuffer = Buffer.from(source, "base64");
  return optimizeImageBuffer(rawBuffer, "image/jpeg");
}
