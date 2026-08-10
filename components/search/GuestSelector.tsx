"use client";

import { useEffect, useRef, useState } from "react";
import { Users, Minus, Plus, ChevronDown } from "lucide-react";
import { pluralGuests } from "@/lib/utils";

export default function GuestSelector({
  adults,
  kids,
  onChange,
}: {
  adults: number;
  kids: number;
  onChange: (next: { adults: number; children: number }) => void;
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
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-left text-sm text-ink transition hover:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      >
        <Users className="h-4 w-4 text-ink-muted" />
        <span className="flex-1 truncate">{pluralGuests(total)}</span>
        <ChevronDown className="h-4 w-4 text-ink-muted" />
      </button>

      {open && (
        <div className="absolute left-0 top-full z-30 mt-2 w-full min-w-[240px] rounded-2xl border border-slate-200 bg-white p-3 shadow-card-hover">
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
      )}
    </div>
  );
}
