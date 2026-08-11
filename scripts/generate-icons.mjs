/* Генерация фирменных иконок IK-HOUSE из знака логотипа (Logo.tsx):
 * скруглённый квадрат с градиентом brand-500 → lake-600 и белым домиком с волной.
 * Запуск: node scripts/generate-icons.mjs
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";

// Пути знака — 1:1 из components/layout/Logo.tsx (LogoMark, viewBox 0 0 48 48):
// гора-крыша + дальняя гора + дом + дверь + волны.
const HOUSE = `
  <path d="M28 21 35 13.5 43.5 23.5" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M7.5 27 21 12.5 33.5 26" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M13 25.5V33a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 29 33v-7.5" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M18.8 35v-4.2a2.2 2.2 0 0 1 4.4 0V35" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <path d="M7 41.5c2.4-1.9 5-1.9 7.4 0s5 1.9 7.4 0 5-1.9 7.4 0 5 1.9 7.4 0" stroke="#a5e3f5" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
`;

const GRAD = `
  <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0" stop-color="#2563eb"/>
    <stop offset="1" stop-color="#0891b2"/>
  </linearGradient>
`;

/** Скруглённый квадрат (прозрачные углы). glyphRatio — доля стороны под домик. */
function roundedSvg(size, radiusRatio, glyphRatio) {
  const r = Math.round(size * radiusRatio);
  const g = size * glyphRatio;
  const off = (size - g) / 2;
  const scale = g / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${GRAD}</defs>
  <rect width="${size}" height="${size}" rx="${r}" fill="url(#g)"/>
  <g transform="translate(${off},${off}) scale(${scale})">${HOUSE}</g>
</svg>`;
}

/** Полная заливка без скругления (apple-touch, maskable). */
function squareSvg(size, glyphRatio) {
  const g = size * glyphRatio;
  const off = (size - g) / 2;
  const scale = g / 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>${GRAD}</defs>
  <rect width="${size}" height="${size}" fill="url(#g)"/>
  <g transform="translate(${off},${off}) scale(${scale})">${HOUSE}</g>
</svg>`;
}

async function png(svg, size, out) {
  await sharp(Buffer.from(svg), { density: 300 })
    .resize(size, size)
    .png()
    .toFile(out);
  console.log("✓", out);
}

mkdirSync("public/icons", { recursive: true });

// В шапке: иконка h-9 rounded-xl (12px/36px ≈ 0.33... скругление визуально ~30%),
// домик h-5/w-5 из h-9 → 55.5% стороны. Для app-иконок берём чуть крупнее.
// 1) Manifest icons (purpose any) — скруглённый квадрат, как знак в шапке
await png(roundedSvg(192, 0.24, 0.58), 192, "public/icons/icon-192.png");
await png(roundedSvg(512, 0.24, 0.58), 512, "public/icons/icon-512.png");
// 2) Maskable — полная заливка, домик в safe zone (40% стороны ≈ внутри круга 80%)
await png(squareSvg(512, 0.44), 512, "public/icons/icon-maskable-512.png");
// 3) Apple touch icon 180x180 — полная заливка без прозрачности (iOS сам скругляет)
await png(squareSvg(180, 0.56), 180, "public/icons/apple-touch-icon.png");
// 4) Next.js file-based: app/icon.png + app/apple-icon.png
await png(roundedSvg(512, 0.24, 0.58), 512, "app/icon.png");
await png(squareSvg(180, 0.56), 180, "app/apple-icon.png");

// 5) favicon.ico (16/32/48) из скруглённого знака
const sizes = [16, 32, 48];
const bufs = [];
for (const s of sizes) {
  bufs.push(await sharp(Buffer.from(roundedSvg(s, 0.24, 0.62)), { density: 300 }).resize(s, s).png().toBuffer());
}
// Собираем .ico вручную (PNG-встраивание поддерживается для ico)
function buildIco(pngs, dims) {
  const count = pngs.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); header.writeUInt16LE(1, 2); header.writeUInt16LE(count, 4);
  const entries = [];
  let offset = 6 + 16 * count;
  pngs.forEach((b, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(dims[i] === 256 ? 0 : dims[i], 0);
    e.writeUInt8(dims[i] === 256 ? 0 : dims[i], 1);
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
