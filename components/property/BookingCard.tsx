"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Users, ShieldCheck, Eye, Flame } from "lucide-react";
import type { Property } from "@/types/property";
import { calcPrice } from "@/lib/pricing";
import { formatSom, priceLabel, pluralNights, todayISO, toISODate } from "@/lib/utils";

function nextDay(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

function rangeHasBlocked(
  checkIn: string,
  checkOut: string,
  blocked: string[],
): boolean {
  if (!checkIn || !checkOut) return false;
  const set = new Set(blocked);
  const cur = new Date(checkIn + "T00:00:00");
  const end = new Date(checkOut + "T00:00:00");
  while (cur < end) {
    if (set.has(toISODate(cur))) return true;
    cur.setDate(cur.getDate() + 1);
  }
  return false;
}

export default function BookingCard({
  property,
  viewers,
  spotsLeft,
}: {
  property: Property;
  viewers: number;
  spotsLeft: number;
}) {
  const router = useRouter();
  const today = todayISO();
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const breakdown = useMemo(
    () => calcPrice(property.pricePerNight, checkIn, checkOut),
    [property.pricePerNight, checkIn, checkOut],
  );

  const blocked = rangeHasBlocked(
    checkIn,
    checkOut,
    property.blockedDates ?? [],
  );
  const canBook = breakdown.nights > 0 && !blocked;

  function handleCheckIn(v: string) {
    setCheckIn(v);
    if (v && (!checkOut || checkOut <= v)) setCheckOut(nextDay(v));
  }

  function book() {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    params.set("guests", String(guests));
    router.push(`/booking/${property.slug}?${params.toString()}`);
  }

  return (
    <div className="card p-5">
      <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
        <ShieldCheck className="h-3.5 w-3.5" /> Проверено IK-HOUSE
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-extrabold text-ink">
          {priceLabel(property.pricePerNight)}
        </span>
        <span className="text-sm text-ink-muted">/ ночь</span>
        {property.oldPrice && (
          <span className="ml-1 text-sm text-slate-400 line-through">
            {formatSom(property.oldPrice)}
          </span>
        )}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div>
          <label className="label">Заезд</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckIn(e.target.value)}
              className="input pl-8 text-sm"
              aria-label="Дата заезда"
            />
          </div>
        </div>
        <div>
          <label className="label">Выезд</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="date"
              value={checkOut}
              min={checkIn ? nextDay(checkIn) : nextDay(today)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="input pl-8 text-sm"
              aria-label="Дата выезда"
            />
          </div>
        </div>
      </div>

      <div className="mt-2">
        <label className="label">Гости</label>
        <div className="relative">
          <Users className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="input appearance-none pl-8 text-sm"
            aria-label="Количество гостей"
          >
            {Array.from({ length: property.guests }).map((_, i) => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
        </div>
      </div>

      {blocked && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          На выбранные даты есть занятые дни. Пожалуйста, выберите другой период.
        </p>
      )}

      {breakdown.nights > 0 && (
        <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>
              {priceLabel(property.pricePerNight)} × {pluralNights(breakdown.nights)}
            </span>
            <span>{priceLabel(breakdown.subtotal)}</span>
          </div>
          <div className="flex justify-between text-base font-extrabold text-ink">
            <span>Итого</span>
            <span>{priceLabel(breakdown.total)}</span>
          </div>
        </div>
      )}

      <button
        onClick={book}
        disabled={!canBook}
        className="btn-cta mt-4 w-full text-base uppercase tracking-wide"
      >
        Забронировать
      </button>

      {!checkIn && (
        <p className="mt-2 text-center text-xs text-ink-muted">
          Выберите даты, чтобы увидеть итоговую стоимость
        </p>
      )}

      <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3 text-xs text-ink-muted">
        <div className="flex items-center gap-1.5">
          <Eye className="h-3.5 w-3.5" /> Сейчас смотрят {viewers} человек
        </div>
        <div className="flex items-center gap-1.5 text-rose-500">
          <Flame className="h-3.5 w-3.5" /> Осталось {spotsLeft} свободных вариантов на эти даты
        </div>
      </div>
    </div>
  );
}
