import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FavoritesProvider } from "@/components/favorites/FavoritesProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import BottomNav from "@/components/layout/BottomNav";
import PwaProvider from "@/components/pwa/PwaProvider";
import Analytics from "@/components/Analytics";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://ik-house-app.vercel.app"),
  applicationName: "IK-HOUSE",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "IK-HOUSE",
  },
  // Иконки задаются file-based метаданными Next.js:
  // app/favicon.ico, app/icon.png, app/apple-icon.png —
  // конфиг metadata.icons при наличии этих файлов игнорируется Next'ом.
  title: {
    default: "Аренда жилья на Иссык-Куле | IK-HOUSE",
    template: "%s | IK-HOUSE",
  },
  description:
    "Коттеджи, гостевые дома и пансионаты на Иссык-Куле. Найдите жильё на Северном и Южном берегу и отправьте заявку онлайн.",
  keywords: [
    "Иссык-Куль",
    "аренда жилья",
    "коттеджи",
    "гостевые дома",
    "пансионаты",
    "Чолпон-Ата",
    "бронирование",
  ],
  openGraph: {
    title: "Аренда жилья на Иссык-Куле | IK-HOUSE",
    description:
      "Коттеджи, гостевые дома и пансионаты на Иссык-Куле напрямую от владельцев.",
    type: "website",
    locale: "ru_RU",
    siteName: "IK-HOUSE",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Manrope:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <FavoritesProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <BottomNav />
          </div>
        </FavoritesProvider>
        <PwaProvider />
        <Analytics />
      </body>
    </html>
  );
}
