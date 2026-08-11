"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";

/* Social proof под поисковым виджетом.
 * simulatedViewers — визуальный mock-интерес (НЕ реальная live-аналитика):
 * генерируется один раз при монтировании и не меняется между рендерами.
 * В будущем легко заменить реальным realtime-счётчиком.
 * Ложных заявлений о доступности на конкретные даты не делаем (даты ещё
 * не выбраны), поэтому справа — честная формулировка. */

/* Локальные аватары вымышленных людей (AI-generated, 100k-faces / generated.photos).
 * Декоративные: без кликов, профилей и каких-либо аккаунтов. */
const AVATARS = [
  "/images/avatars/viewer-1.webp",
  "/images/avatars/viewer-2.webp",
  "/images/avatars/viewer-3.webp",
  "/images/avatars/viewer-4.webp",
];

export default function HeroProof() {
  const [simulatedViewers, setSimulatedViewers] = useState<number | null>(null);

  useEffect(() => {
    // 8–20, фиксируется на сессию компонента
    setSimulatedViewers(8 + Math.floor(Math.random() * 13));
  }, []);

  return (
    <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
      <div className="inline-flex w-fit items-center gap-3 rounded-full bg-ink/45 px-4 py-2 backdrop-blur-sm">
        <span className="flex -space-x-2.5">
          {AVATARS.map((src) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={src}
              src={src}
              alt=""
              className="h-7 w-7 rounded-full border-2 border-white/90 sm:h-8 sm:w-8"
            />
          ))}
        </span>
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-sm font-medium text-white">
          Сейчас смотрят {simulatedViewers ?? "…"} человек
        </span>
      </div>

      <div className="inline-flex w-fit items-center gap-2 rounded-full bg-ink/45 px-4 py-2 backdrop-blur-sm">
        <Flame className="h-4 w-4 shrink-0 text-amber-400" />
        <span className="text-sm font-medium text-white">
          Популярные варианты быстро разбирают
        </span>
      </div>
    </div>
  );
}
