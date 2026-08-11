/* Генерация фирменных иконок IK-HOUSE из НОВОГО знака логотипа заказчика
 * (горы + дом + волны, белая версия знака на фирменном градиенте).
 * Требуется файл /tmp/emblem-white.png (белый знак, прозрачный фон).
 * Запуск: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

const EMBLEM = "/tmp/emblem-white.png";

const GRAD = `
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2563eb"/>
    <stop offset="1" stop-color="#0891b2"/>
  </linearGradient>
`;

function bgSvg(size, radiusRatio) {
  const r = Math.round(size * radiusRatio);
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <defs>${GRAD}</defs><rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/></svg>`);
}

async function icon(size, radiusRatio, glyphRatio, out) {
  const g = Math.round(size * glyphRatio);
  const glyph = await sharp(EMBLEM)
    .resize({ width: g, height: g, fit: "inside" })
    .png()
    .toBuffer();
  const meta = await sharp(glyph).metadata();
  await sharp(bgSvg(size, radiusRatio))
    .composite([
      {
        input: glyph,
        left: Math.round((size - meta.width) / 2),
        top: Math.round((size - meta.height) / 2),
      },
    ])
    .png()
    .toFile(out);
  console.log("✓", out);
}

mkdirSync("public/icons", { recursive: true });

// Manifest icons (purpose any) — скруглённый квадрат
await icon(192, 0.24, 0.78, "public/icons/icon-192.png");
await icon(512, 0.24, 0.78, "public/icons/icon-512.png");
// Maskable — полная заливка, знак в safe zone
await icon(512, 0, 0.52, "public/icons/icon-maskable-512.png");
// Apple touch — полная заливка (iOS сам скругляет)
await icon(180, 0, 0.8, "public/icons/apple-touch-icon.png");
// Next.js file-based
await icon(512, 0.24, 0.78, "app/icon.png");
await icon(180, 0, 0.8, "app/apple-icon.png");

// favicon.ico (16/32/48)
const sizes = [16, 32, 48];
const bufs = [];
for (const s of sizes) {
  await icon(s, 0.24, 0.8, `/tmp/fav-${s}.png`);
  bufs.push(await sharp(`/tmp/fav-${s}.png`).png().toBuffer());
}
function buildIco(pngs, dims) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + 16 * count;
  pngs.forEach((b, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(dims[i], 0); e.writeUInt8(dims[i], 1);
    e.writeUInt8(0, 2); e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4); e.writeUInt16LE(32, 6);
    e.writeUInt32LE(b.length, 8); e.writeUInt32LE(offset, 12);
    offset += b.length;
    entries.push(e);
  });
  return Buffer.concat([header, ...entries, ...pngs]);
}
writeFileSync("app/favicon.ico", buildIco(bufs, sizes));
console.log("✓ app/favicon.ico");
