"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn, toISODate } from "@/lib/utils";

export default function OwnerCalendar({
  propertyId,
  initialBlocked,
  booked,
}: {
  propertyId: string;
  initialBlocked: string[];
  booked: string[];
}) {
  const [blocked, setBlocked] = useState<Set<string>>(new Set(initialBlocked));
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [savedTick, setSavedTick] = useState(false);
  const [error, setError] = useState("");
  const bookedSet = useMemo(() => new Set(booked), [booked]);

  const now = new Date();
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const todayIso = toISODate(new Date());

  const cells = useMemo(() => {
    const first = new Date(cursor.y, cursor.m, 1);
    const startWeekday = (first.getDay() + 6) % 7;
    const days = new Date(cursor.y, cursor.m + 1, 0).getDate();
    const out: (string | null)[] = [];
    for (let i = 0; i < startWeekday; i++) out.push(null);
    for (let d = 1; d <= days; d++) out.push(toISODate(new Date(cursor.y, cursor.m, d)));
    return out;
  }, [cursor]);

  async function toggle(iso: string) {
    if (bookedSet.has(iso) || iso < todayIso || pending.has(iso)) return;
    setError("");
    const isBlocked = blocked.has(iso);

    // мгновенный отклик
    setBlocked((s) => {
      const n = new Set(s);
      if (isBlocked) n.delete(iso);
      else n.add(iso);
      return n;
    });
    setPending((s) => new Set(s).add(iso));

    const supabase = createClient();
    const op = isBlocked
      ? supabase
          .from("property_availability")
          .delete()
          .eq("property_id", propertyId)
          .eq("date", iso)
          .eq("status", "blocked")
      : supabase.from("property_availability").upsert(
          { property_id: propertyId, date: iso, status: "blocked" },
          { onConflict: "property_id,date", ignoreDuplicates: true },
        );

    const { error: dbErr } = await op;
    setPending((s) => {
      const n = new Set(s);
      n.delete(iso);
      return n;
    });
    if (dbErr) {
      // откат
      setBlocked((s) => {
        const n = new Set(s);
        if (isBlocked) n.add(iso);
        else n.delete(iso);
        return n;
      });
      setError("Не удалось сохранить. Проверьте соединение.");
      return;
    }
    setSavedTick(true);
    setTimeout(() => setSavedTick(false), 1500);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <button
          type="button"
          aria-label="Предыдущий месяц"
          onClick={() =>
            setCursor((c) => (c.m === 0 ? { y: c.y - 1, m: 11 } : { y: c.y, m: c.m - 1 }))
          }
          className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="font-bold text-ink">
          {new Date(cursor.y, cursor.m).toLocaleDateString("ru-RU", {
            month: "long",
            year: "numeric",
          })}
        </div>
        <button
          type="button"
          aria-label="Следующий месяц"
          onClick={() =>
            setCursor((c) => (c.m === 11 ? { y: c.y + 1, m: 0 } : { y: c.y, m: c.m + 1 }))
          }
          className="grid h-11 w-11 place-items-center rounded-lg text-ink-soft hover:bg-slate-100"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 grid grid-cols-7 text-center text-xs font-semibold text-ink-muted">
        {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((d) => (
          <div key={d} className="py-1.5">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((iso, i) =>
          iso === null ? (
            <div key={`e${i}`} />
          ) : (
            <button
              key={iso}
              type="button"
              disabled={iso < todayIso || bookedSet.has(iso)}
              onClick={() => toggle(iso)}
              className={cn(
                "relative grid aspect-square min-h-10 place-items-center rounded-lg text-sm font-medium transition",
                iso < todayIso
                  ? "text-slate-300"
                  : bookedSet.has(iso)
                    ? "bg-brand-100 font-bold text-brand-700"
                    : blocked.has(iso)
                      ? "bg-rose-100 text-rose-600 line-through"
                      : "text-ink hover:bg-slate-100",
              )}
            >
              {parseInt(iso.slice(8), 10)}
              {pending.has(iso) && (
                <Loader2 className="absolute right-0.5 top-0.5 h-3 w-3 animate-spin text-ink-muted" />
              )}
            </button>
          ),
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-slate-200" /> Свободно
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-rose-100" /> Закрыто вами
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-brand-100" /> Забронировано
        </span>
        {savedTick && (
          <span className="inline-flex items-center gap-1 font-medium text-emerald-600">
            <CheckCircle2 className="h-3.5 w-3.5" /> Сохранено
          </span>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-rose-500">{error}</p>}
    </div>
  );
}
