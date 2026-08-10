/** @type {import('next').NextConfig} */

// Статический экспорт для GitHub Pages включается через BUILD_TARGET=export.
// Путь задаётся через PAGES_BASE_PATH (по умолчанию /aurenta/ik-house).
const isExport = process.env.BUILD_TARGET === "export";
const basePath = process.env.PAGES_BASE_PATH ?? "/aurenta/ik-house";

const nextConfig = {
  reactStrictMode: true,
  optimizeFonts: false,
  images: {
    // На статическом хостинге оптимизатор недоступен — грузим фото напрямую.
    unoptimized: true,
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
      { protocol: "https", hostname: "plus.unsplash.com" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  ...(isExport
    ? {
        output: "export",
        basePath,
        assetPrefix: `${basePath}/`,
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
