"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Calendar, Search } from "lucide-react";
import GuestSelector from "@/components/search/GuestSelector";
import { LOCATIONS } from "@/lib/constants";
import { todayISO, toISODate } from "@/lib/utils";
import { cn } from "@/lib/utils";

const LOCATION_OPTIONS = [
  "Весь Иссык-Куль",
  ...LOCATIONS,
  "Южный берег",
  "Северный берег",
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

    router.push(`/catalog?${params.toString()}`);
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white p-3 shadow-card-hover",
        variant === "hero" ? "sm:p-4" : "",
      )}
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-12">
        {/* Локация */}
        <div className="md:col-span-4">
          <label className="label">Локация</label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="input appearance-none pl-9"
              aria-label="Локация"
            >
              {LOCATION_OPTIONS.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Заезд */}
        <div className="md:col-span-2">
          <label className="label">Заезд</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => handleCheckIn(e.target.value)}
              className="input pl-9"
              aria-label="Дата заезда"
            />
          </div>
        </div>

        {/* Выезд */}
        <div className="md:col-span-2">
          <label className="label">Выезд</label>
          <div className="relative">
            <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
            <input
              type="date"
              value={checkOut}
              min={checkIn ? nextDay(checkIn) : nextDay(today)}
              onChange={(e) => setCheckOut(e.target.value)}
              className="input pl-9"
              aria-label="Дата выезда"
            />
          </div>
        </div>

        {/* Гости */}
        <div className="md:col-span-2">
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

        {/* Кнопка */}
        <div className="flex items-end md:col-span-2">
          <button onClick={submit} className="btn-cta h-[42px] w-full">
            <Search className="h-4 w-4" />
            Найти
          </button>
        </div>
      </div>
    </div>
  );
}
