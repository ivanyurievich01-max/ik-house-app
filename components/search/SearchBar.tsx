"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, Home, ArrowRight, Search } from "lucide-react";
import GuestSelector from "@/components/search/GuestSelector";
import { LOCATIONS, TYPE_LABELS, FILTER_TYPES } from "@/lib/constants";
import { todayISO, toISODate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LOCATION_OPTIONS = [
  "Весь Иссык-Куль",
  ...LOCATIONS,
  "Южный берег",
  "Северный берег",
];

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Любой тип" },
  ...FILTER_TYPES.map((t) => ({ value: t, label: TYPE_LABELS[t] })),
];

function nextDay(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

export default function SearchBar({ variant = "hero" }: { variant?: "hero" | "page" }) {
  const router = useRouter();
  const today = todayISO();

  const [location, setLocation] = useState("Весь Иссык-Куль");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [type, setType] = useState("");

  function handleCheckIn(v: string) {
    setCheckIn(v);
    // checkout не может быть раньше или равен check-in
    if (v && (!checkOut || checkOut <= v)) {
      setCheckOut(nextDay(v));
    }
  }

  function submit() {
    const params = new URLSearchParams();
    if (location === "Южный берег") params.set("shore", "south");
    else if (location === "Северный берег") params.set("shore", "north");
    else if (location !== "Весь Иссык-Куль") params.set("location", location);

    if (checkIn) params.set("checkin", checkIn);
    if (checkOut) params.set("checkout", checkOut);
    const guests = adults + children;
    if (guests > 0) params.set("guests", String(guests));
    if (type) params.set("type", type);

    router.push(`/catalog?${params.toString()}`);
  }

  const hero = variant === "hero";

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-3 shadow-card-hover",
        hero ? "sm:p-4 lg:rounded-[20px]" : "",
      )}
    >
      <div
        className={cn(
          "grid grid-cols-1 gap-3",
          hero
            ? "lg:grid-cols-[1.35fr_1.7fr_1fr_1fr_auto] lg:items-end"
            : "md:grid-cols-12",
        )}
      >
        {/* Локация */}
        <div className={hero ? "" : "md:col-span-4"}>
          <label className="label">Куда хотите?</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input appearance-none pl-9"
              aria-label="Куда хотите поехать"
            >
              {LOCATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Заезд — Выезд */}
        <div className={hero ? "" : "md:col-span-4"}>
          <label className="label">Заезд — Выезд</label>
          <div className="grid min-w-0 grid-cols-2 gap-2">
            <div className="relative min-w-0">
              <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="date"
                value={checkIn}
                min={today}
                onChange={(e) => handleCheckIn(e.target.value)}
                className="input min-w-0 pl-8 pr-1 text-sm"
                aria-label="Дата заезда"
              />
            </div>
            <div className="relative min-w-0">
              <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="date"
                value={checkOut}
                min={checkIn ? nextDay(checkIn) : nextDay(today)}
                onChange={(e) => setCheckOut(e.target.value)}
                className="input min-w-0 pl-8 pr-1 text-sm"
                aria-label="Дата выезда"
              />
            </div>
          </div>
        </div>

        {/* Гости */}
        <div className={hero ? "" : "md:col-span-2"}>
          <label className="label">Гости</label>
          <GuestSelector
            adults={adults}
            kids={children}
            onChange={(n) => {
              setAdults(n.adults);
              setChildren(n.children);
            }}
          />
        </div>

        {/* Тип жилья */}
        <div className={hero ? "" : "md:col-span-2"}>
          <label className="label">Тип жилья</label>
          <div className="relative">
            <Home className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="input appearance-none pl-9"
              aria-label="Тип жилья"
            >
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Кнопка */}
        <div className={hero ? "flex items-end" : "flex items-end md:col-span-12"}>
          <button onClick={submit} className="btn-cta h-[42px] w-full lg:whitespace-nowrap lg:px-5">
            {hero ? (
              <>
                Показать варианты <ArrowRight className="h-4 w-4" />
              </>
            ) : (
              <>
                <Search className="h-4 w-4" />
                Найти
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
