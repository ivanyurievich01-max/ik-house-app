import Link from "next/link";
import { cn } from "@/lib/utils";

/** Фирменный знак IK-HOUSE: гора-крыша + дом + волны Иссык-Куля.
 *  Лёгкий линейный стиль; те же пути используются в scripts/generate-icons.mjs. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="ikh-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#2563eb" />
          <stop offset="1" stopColor="#0891b2" />
        </linearGradient>
      </defs>
      {/* Дальняя гора */}
      <path
        d="M28 21 35 13.5 43.5 23.5"
        stroke="url(#ikh-mark)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Гора-крыша */}
      <path
        d="M7.5 27 21 12.5 33.5 26"
        stroke="url(#ikh-mark)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Дом */}
      <path
        d="M13 25.5V33a2.5 2.5 0 0 0 2.5 2.5h11A2.5 2.5 0 0 0 29 33v-7.5"
        stroke="url(#ikh-mark)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Дверь */}
      <path
        d="M18.8 35v-4.2a2.2 2.2 0 0 1 4.4 0V35"
        stroke="url(#ikh-mark)"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Волны */}
      <path
        d="M7 41.5c2.4-1.9 5-1.9 7.4 0s5 1.9 7.4 0 5-1.9 7.4 0 5 1.9 7.4 0"
        stroke="#06b6d4"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Logo({
  className,
  withTagline = true,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2", className)}
      aria-label="IK-HOUSE — на главную"
    >
      <LogoMark className="h-10 w-10 shrink-0" />
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-ink">
          IK<span className="text-brand-500">-</span>HOUSE
        </span>
        {withTagline && (
          <span className="mt-0.5 hidden text-[11px] font-medium text-ink-muted sm:block">
            Иссык-Куль — отдых как ты хочешь
          </span>
        )}
      </span>
    </Link>
  );
}
