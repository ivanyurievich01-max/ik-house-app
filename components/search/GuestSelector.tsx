"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Minus, Plus, ChevronDown } from "lucide-react";
import { pluralGuests } from "@/lib/utils";

export default function GuestSelector({
  adults,
  kids,
  onChange,
  variant = "field",
}: {
  adults: number;
  kids: number;
  onChange: (next: { adults: number; children: number }) => void;
  /** field — обычное поле (desktop); row — половинка строки мобильной панели;
   *  bar — компактный сегмент однострочного mobile search bar */
  variant?: "field" | "row" | "bar";
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const total = adults + kids;

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const row = (
    label: string,
    hint: string,
    value: number,
    key: "adults" | "children",
    min: number,
  ) => (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="text-sm font-semibold text-ink">{label}</div>
        <div className="text-xs text-ink-muted">{hint}</div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label={`Убавить ${label}`}
          disabled={value <= min}
          onClick={() =>
            onChange({
              adults: key === "adults" ? value - 1 : adults,
              children: key === "children" ? value - 1 : kids,
            })
          }
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-ink-soft transition hover:border-brand-400 disabled:opacity-40"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-5 text-center text-sm font-semibold">{value}</span>
        <button
          type="button"
          aria-label={`Добавить ${label}`}
          onClick={() =>
            onChange({
              adults: key === "adults" ? value + 1 : adults,
              children: key === "children" ? value + 1 : kids,
            })
          }
          className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 text-ink-soft transition hover:border-brand-400"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className={variant === "row" ? "" : variant === "bar" ? "h-full" : "relative"} ref={ref}>
      {variant === "bar" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Гости"
          className="flex h-full w-full items-center gap-1.5 px-2 py-1.5 text-left"
        >
          <Users className="h-[18px] w-[18px] shrink-0 text-ink" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-bold leading-tight text-ink">
              {pluralGuests(total)}
            </span>
            <span className="block truncate text-[10px] leading-tight text-ink-muted">
              Гости
            </span>
          </span>
        </button>
      ) : variant === "row" ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2.5 px-4 py-3 text-left"
        >
          <Users className="h-5 w-5 shrink-0 text-ink" />
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
              Гости
            </span>
            <span className="block truncate text-[15px] font-bold text-ink">
              {pluralGuests(total)}
            </span>
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm text-ink transition hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
        >
          <Users className="h-4 w-4 text-ink-muted" />
          <span className="flex-1 truncate">{pluralGuests(total)}</span>
          <ChevronDown className="h-4 w-4 text-ink-muted" />
        </button>
      )}

      {open && (
        <>
          {/* Mobile: подложка bottom sheet */}
          <div
            className="fixed inset-0 z-[60] bg-ink/40 sm:hidden"
            onClick={() => setOpen(false)}
          />
          {/* Desktop: попап под полем поверх любых секций;
              Mobile: bottom sheet с учётом safe-area */}
          <div className="fixed inset-x-0 bottom-0 z-[70] rounded-t-2xl border border-slate-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-card-hover sm:absolute sm:inset-x-auto sm:bottom-auto sm:left-0 sm:top-full sm:mt-2 sm:w-full sm:min-w-[250px] sm:rounded-2xl sm:p-3 sm:pb-3">
            <div className="mb-1 text-sm font-bold text-ink sm:hidden">
              Гости
            </div>
            {row("Взрослые", "от 13 лет", adults, "adults", 1)}
            <div className="border-t border-slate-100" />
            {row("Дети", "0–12 лет", kids, "children", 0)}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="btn-outline mt-3 w-full py-2 text-xs"
            >
              Готово
            </button>
          </div>
        </>
      )}
    </div>
  );
}
