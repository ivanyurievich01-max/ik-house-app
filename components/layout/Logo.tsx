import Link from "next/link";
import { cn } from "@/lib/utils";

/* Фирменный логотип IK-HOUSE (файл заказчика, прозрачный фон):
 * знак «горы + дом + волны» + IK-HOUSE + tagline.
 * - logo-full-dark.png  — версия с тёмным текстом для светлого header/footer;
 * - logo-full-white.png — оригинал с белым текстом для тёмных фонов.
 * Исходный lockup 1236×337. */

export default function Logo({
  className,
  variant = "dark",
  withTagline = true, // сохранён для совместимости; tagline — часть lockup
}: {
  className?: string;
  variant?: "dark" | "white";
  withTagline?: boolean;
}) {
  const src =
    variant === "white"
      ? "/images/logo/logo-full-white.png"
      : "/images/logo/logo-full-dark.png";
  return (
    <Link
      href="/"
      className={cn("flex shrink-0 items-center", className)}
      aria-label="IK-HOUSE — на главную"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt="IK-HOUSE — Иссык-Куль: отдых как ты хочешь"
        className="h-10 w-auto sm:h-12"
        width={1236}
        height={337}
      />
    </Link>
  );
}
