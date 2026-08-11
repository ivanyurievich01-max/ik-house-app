"use client";

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";
import { ChevronRight as Chevron } from "lucide-react";
import { todayISO, toISODate } from "@/lib/utils";
import { cn } from "@/lib/utils";

/* Единый Date Range Picker «Заезд — Выезд» в стиле IK-HOUSE.
 * Desktop: попап с двумя месяцами под полем.
 * Mobile: bottom sheet с одним месяцем и кнопкой «Применить».
 * Валидация: прошлые даты disabled, check-out строго позже check-in
 * (минимум 1 ночь). Кастомный UI, бизнес-логика дат не менялась. */

const MONTHS = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
];
const MONTHS_SHORT = [
  "янв", "фев", "мар", "апр", "мая", "июн",
  "июл", "авг", "сен", "окт", "ноя", "дек",
];
const WEEKDAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function fmtShort(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return `${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`;
}

/** Ячейки месяца: массив из ISO-дат и null (пустые клетки до 1-го числа). */
function monthCells(year: number, month: number): (string | null)[] {
  const first = new Date(year, month, 1);
  const lead = (first.getDay() + 6) % 7; // Пн = 0
  const days = new Date(year, month + 1, 0).getDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) {
    cells.push(toISODate(new Date(year, month, d)));
  }
  return cells;
}

function MonthGrid({
  year,
  month,
  checkIn,
  checkOut,
  hoverDate,
  today,
  onPick,
  onHover,
}: {
  year: number;
  month: number;
  checkIn: string;
  checkOut: string;
  hoverDate: string;
  today: string;
  onPick: (iso: string) => void;
  onHover: (iso: string) => void;
}) {
  const cells = monthCells(year, month);
  // Предпросмотр диапазона при наведении (когда выбран только заезд)
  const rangeEnd = checkOut || (hoverDate > checkIn ? hoverDate : "");
  return (
    <div className="w-full sm:w-[272px]">
      <div className="mb-2 text-center text-sm font-bold text-ink">
        {MONTHS[month]} {year}
      </div>
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold uppercase text-ink-muted">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1">
            {w}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((iso, i) => {
          if (!iso) return <span key={`e${i}`} />;
          const disabled = iso < today;
          const isStart = iso === checkIn;
          const isEnd = iso === checkOut;
          const inRange =
            checkIn && rangeEnd && iso > checkIn && iso < rangeEnd;
          return (
            <button
              key={iso}
              type="button"
              disabled={disabled}
              onClick={() => onPick(iso)}
              onMouseEnter={() => onHover(iso)}
              className={cn(
                "relative h-9 text-sm transition",
                disabled && "cursor-not-allowed text-slate-300",
                !disabled && !isStart && !isEnd && !inRange && "hover:bg-brand-50 rounded-lg text-ink",
                inRange && "bg-brand-100 text-brand-800",
                (isStart || isEnd) &&
                  "z-10 rounded-lg bg-brand-600 font-bold text-white",
                isStart && (checkOut || rangeEnd) && "rounded-r-none",
                isEnd && "rounded-l-none",
              )}
            >
              {Number(iso.slice(8, 10))}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function fmtDots(iso: string): string {
  return `${iso.slice(8, 10)}.${iso.slice(5, 7)}.${iso.slice(0, 4)}`;
}

export default function DateRangePicker({
  checkIn,
  checkOut,
  onChange,
  variant = "field",
}: {
  checkIn: string;
  checkOut: string;
  onChange: (next: { checkIn: string; checkOut: string }) => void;
  /** field — обычное поле (desktop); row — строка мобильной search-панели */
  variant?: "field" | "row";
}) {
  const [open, setOpen] = useState(false);
  const [hoverDate, setHoverDate] = useState("");
  const today = todayISO();
  const initial = checkIn ? new Date(checkIn + "T00:00:00") : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  function shift(delta: number) {
    const d = new Date(viewYear, viewMonth + delta, 1);
    // не уходить в прошлое
    const now = new Date();
    if (d.getFullYear() < now.getFullYear() ||
        (d.getFullYear() === now.getFullYear() && d.getMonth() < now.getMonth())) {
      return;
    }
    setViewYear(d.getFullYear());
    setViewMonth(d.getMonth());
  }

  function pick(iso: string) {
    if (!checkIn || (checkIn && checkOut)) {
      onChange({ checkIn: iso, checkOut: "" });
    } else if (iso > checkIn) {
      onChange({ checkIn, checkOut: iso });
    } else {
      onChange({ checkIn: iso, checkOut: "" });
    }
  }

  const next = new Date(viewYear, viewMonth + 1, 1);
  const label =
    checkIn && checkOut
      ? `${fmtShort(checkIn)} — ${fmtShort(checkOut)}`
      : checkIn
        ? `${fmtShort(checkIn)} — выезд?`
        : "Выберите даты";

  const calendarBody = (twoMonths: boolean) => (
    <>
      <div className="relative flex items-start justify-center gap-6">
        <button
          type="button"
          aria-label="Предыдущий месяц"
          onClick={() => shift(-1)}
          className="absolute left-0 top-0 grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <MonthGrid
          year={viewYear}
          month={viewMonth}
          checkIn={checkIn}
          checkOut={checkOut}
          hoverDate={hoverDate}
          today={today}
          onPick={pick}
          onHover={setHoverDate}
        />
        {twoMonths && (
          <MonthGrid
            year={next.getFullYear()}
            month={next.getMonth()}
            checkIn={checkIn}
            checkOut={checkOut}
            hoverDate={hoverDate}
            today={today}
            onPick={pick}
            onHover={setHoverDate}
          />
        )}
        <button
          type="button"
          aria-label="Следующий месяц"
          onClick={() => shift(1)}
          className="absolute right-0 top-0 grid h-8 w-8 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-ink-muted">
        <span>
          {checkIn && !checkOut && "Выберите дату выезда"}
          {checkIn && checkOut && "Минимум 1 ночь"}
          {!checkIn && "Выберите дату заезда"}
        </span>
        {(checkIn || checkOut) && (
          <button
            type="button"
            onClick={() => onChange({ checkIn: "", checkOut: "" })}
            className="font-semibold text-brand-600 hover:text-brand-700"
          >
            Сбросить
          </button>
        )}
      </div>
    </>
  );

  const rowLabel =
    checkIn && checkOut
      ? `${fmtDots(checkIn)} — ${fmtDots(checkOut)}`
      : checkIn
        ? `${fmtDots(checkIn)} — выезд?`
        : "Выберите даты";

  return (
    <div className="relative" ref={ref}>
      {variant === "row" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Заезд — выезд"
          className="flex w-full items-center gap-3 px-4 py-3 text-left"
        >
          <Calendar className="h-5 w-5 shrink-0 text-ink" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Заезд — Выезд
            </span>
            <span
              className={cn(
                "block truncate text-[15px] font-bold",
                checkIn ? "text-ink" : "text-ink-soft",
              )}
            >
              {rowLabel}
            </span>
          </span>
          <Chevron className="h-4 w-4 shrink-0 text-ink-muted" />
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Заезд — выезд"
          className="flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm transition hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <Calendar className="h-4 w-4 shrink-0 text-ink-muted" />
          <span
            className={cn(
              "flex-1 truncate",
              checkIn ? "text-ink" : "text-slate-400",
            )}
          >
            {label}
          </span>
        </button>
      )}

      {open && (
        <>
          {/* Mobile: подложка */}
          <div
            className="fixed inset-0 z-[60] bg-ink/40 sm:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Desktop: попап под полем; Mobile: bottom sheet */}
          <div
            className="fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border border-slate-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-card-hover sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:w-[608px] sm:max-w-[calc(100vw-2rem)] sm:rounded-2xl sm:pb-4"
          >
            <div className="mb-2 flex items-center justify-between sm:hidden">
              <span className="text-sm font-bold text-ink">Заезд — Выезд</span>
              <button
                type="button"
                aria-label="Закрыть"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {/* Один месяц на mobile, два на desktop */}
            <div className="sm:hidden">{calendarBody(false)}</div>
            <div className="hidden sm:block">{calendarBody(true)}</div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-primary mt-3 w-full py-2.5 text-sm sm:hidden"
            >
              Применить
            </button>
          </div>
        </>
      )}
    </div>
  );
}
