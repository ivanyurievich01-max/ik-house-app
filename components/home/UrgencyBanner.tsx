"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock, ArrowRight } from "lucide-react";

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export default function UrgencyBanner() {
  // Дедлайн вычисляем на клиенте, чтобы не было расхождения SSR/CSR
  const [target, setTarget] = useState<number | null>(null);
  const [left, setLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const t = Date.now() + (2 * 24 * 60 * 60 + 14 * 60 * 60 + 35 * 60) * 1000;
    setTarget(t);
  }, []);

  useEffect(() => {
    if (!target) return;
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const d = Math.floor(diff / (1000 * 60 * 60 * 24));
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setLeft({ d, h, m, s });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [target]);

  const box = (v: number, label: string) => (
    <div className="flex flex-col items-center">
      <div className="grid h-14 w-14 place-items-center rounded-xl bg-white/15 text-2xl font-extrabold tabular-nums backdrop-blur sm:h-16 sm:w-16 sm:text-3xl">
        {pad(v)}
      </div>
      <span className="mt-1 text-[11px] uppercase tracking-wide text-white/80">
        {label}
      </span>
    </div>
  );

  return (
    <section className="container-page py-14">
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-lake-600 px-6 py-8 text-white shadow-card-hover sm:px-10 sm:py-10">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5" /> Летнее предложение
            </div>
            <h2 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Летние цены заканчиваются
            </h2>
            <p className="mt-1 max-w-md text-white/85">
              Успейте забронировать жильё на лучшие даты до конца акции.
            </p>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {box(left.d, "дней")}
            <span className="pb-5 text-2xl font-bold text-white/70">:</span>
            {box(left.h, "часов")}
            <span className="pb-5 text-2xl font-bold text-white/70">:</span>
            {box(left.m, "минут")}
            <span className="pb-5 text-2xl font-bold text-white/70">:</span>
            {box(left.s, "секунд")}
          </div>
        </div>

        <div className="mt-7">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:gap-3"
          >
            Посмотреть свободное жильё <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
