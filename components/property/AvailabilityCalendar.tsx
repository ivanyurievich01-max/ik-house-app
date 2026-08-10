"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { toISODate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export default function AvailabilityCalendar({
  blockedDates,
}: {
  blockedDates: string[];
}) {
  const now = new Date();
  const [cursor, setCursor] = useState({
    year: now.getFullYear(),
    month: now.getMonth(),
  });

  const blocked = useMemo(() => new Set(blockedDates), [blockedDates]);
  const todayStr = toISODate(now);

  const { cells, canGoBack } = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    const startOffset = (first.getDay() + 6) % 7; // Пн = 0
    const daysInMonth = new Date(
      cursor.year,
      cursor.month + 1,
      0,
    ).getDate();

    const arr: (null | { iso: string; day: number })[] = [];
    for (let i = 0; i < startOffset; i++) arr.push(null);
    for (let d = 1; d <= daysInMonth; d++) {
      const iso = toISODate(new Date(cursor.year, cursor.month, d));
      arr.push({ iso, day: d });
    }
    const back =
      cursor.year > now.getFullYear() ||
      (cursor.year === now.getFullYear() && cursor.month > now.getMonth());
    return { cells: arr, canGoBack: back };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cursor]);

  const shift = (dir: number) => {
    setCursor((c) => {
      const m = c.month + dir;
      const year = c.year + Math.floor(m / 12);
      const month = ((m % 12) + 12) % 12;
      return { year, month };
    });
  };

  return (
    <div className="card p-4">
      <div className="mb-3 flex items-center justify-between">
        <button
          onClick={() => shift(-1)}
          disabled={!canGoBack}
          aria-label="Предыдущий месяц"
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-slate-100 disabled:opacity-30"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm font-bold text-ink">
          {MONTHS[cursor.month]} {cursor.year}
        </span>
        <button
          onClick={() => shift(1)}
          aria-label="Следующий месяц"
          className="grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-1">
            {w}
          </div>
        ))}
      </div>
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((c, i) => {
          if (!c) return <div key={`e-${i}`} />;
          const isPast = c.iso < todayStr;
          const isBlocked = blocked.has(c.iso);
          const unavailable = isPast || isBlocked;
          return (
            <div
              key={c.iso}
              className={cn(
                "grid aspect-square place-items-center rounded-lg text-xs",
                unavailable
                  ? "text-slate-300 line-through"
                  : "bg-emerald-50 font-semibold text-emerald-700",
                isBlocked && !isPast && "bg-rose-50 text-rose-400 line-through",
              )}
            >
              {c.day}
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex items-center gap-4 text-[11px] text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-emerald-100" /> свободно
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-100" /> занято
        </span>
      </div>
    </div>
  );
}
