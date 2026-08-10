/**
 * Клиентское сжатие фотографий перед загрузкой —
 * важно для мобильного интернета (фото с телефона бывают 5–20 МБ).
 */
export const MAX_ORIGINAL_MB = 10;
export const MAX_DIMENSION = 1600;
export const JPEG_QUALITY = 0.82;

export async function compressImage(file: File): Promise<Blob> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Можно загружать только изображения");
  }
  if (file.size > MAX_ORIGINAL_MB * 1024 * 1024) {
    throw new Error(`Файл слишком большой (до ${MAX_ORIGINAL_MB} МБ)`);
  }

  const bitmap = await createImageBitmap(file).catch(() => null);
  if (!bitmap) {
    // формат не поддержан canvas (например, некоторые HEIC) — грузим как есть
    return file;
  }

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(bitmap.width, bitmap.height),
  );
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", JPEG_QUALITY),
  );
  if (!blob) return file;
  // если сжатие не дало выигрыша — оставляем оригинал
  return blob.size < file.size ? blob : file;
}
