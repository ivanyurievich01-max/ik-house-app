"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MapPin, Home, ArrowRight, Search } from "lucide-react";
import GuestSelector from "@/components/search/GuestSelector";
import DateRangePicker from "@/components/search/DateRangePicker";
import OptionSheet from "@/components/search/OptionSheet";
import { LOCATIONS, TYPE_LABELS, FILTER_TYPES } from "@/lib/constants";
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

export default function SearchBar({ variant = "hero" }: { variant?: "hero" | "page" }) {
  const router = useRouter();

  const [location, setLocation] = useState("Весь Иссык-Куль");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [type, setType] = useState("");
  const [locSheet, setLocSheet] = useState(false);
  const [typeSheet, setTypeSheet] = useState(false);

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
  const typeLabel = TYPE_OPTIONS.find((o) => o.value === type)?.label ?? "Любой тип";

  return (
    <div
      className={cn(
        "rounded-2xl border border-slate-200 bg-white shadow-card-hover",
        hero ? "p-2 lg:rounded-[20px] lg:p-4" : "p-3",
      )}
    >
      {/* ===== Mobile / tablet: ОДНА горизонтальная строка (финальный макет) ===== */}
      <div className="flex h-[64px] items-stretch gap-1 lg:hidden">
        {/* Локация */}
        <button
          type="button"
          onClick={() => setLocSheet(true)}
          className="flex min-w-0 flex-[1.15] items-center gap-1.5 px-2 py-1.5 text-left"
        >
          <MapPin className="h-[18px] w-[18px] shrink-0 text-ink" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-bold leading-tight text-ink">
              {location === "Весь Иссык-Куль" ? "Иссык-Куль" : location}
            </span>
            <span className="block truncate text-[10px] leading-tight text-ink-muted">
              Куда хотите?
            </span>
          </span>
        </button>

        <div className="my-2 w-px shrink-0 bg-slate-200" />

        {/* Заезд — Выезд */}
        <div className="min-w-0 flex-[1.35]">
          <DateRangePicker
            variant="bar"
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(next) => {
              setCheckIn(next.checkIn);
              setCheckOut(next.checkOut);
            }}
          />
        </div>

        <div className="my-2 w-px shrink-0 bg-slate-200" />

        {/* Гости */}
        <div className="min-w-0 flex-[0.85]">
          <GuestSelector
            variant="bar"
            adults={adults}
            kids={children}
            onChange={(n) => {
              setAdults(n.adults);
              setChildren(n.children);
            }}
          />
        </div>

        <div className="my-2 w-px shrink-0 bg-slate-200" />

        {/* Тип жилья */}
        <button
          type="button"
          onClick={() => setTypeSheet(true)}
          className="flex min-w-0 flex-[1] items-center gap-1.5 px-2 py-1.5 text-left"
        >
          <Home className="h-[18px] w-[18px] shrink-0 text-ink" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px] font-bold leading-tight text-ink">
              {typeLabel}
            </span>
            <span className="block truncate text-[10px] leading-tight text-ink-muted">
              Тип жилья
            </span>
          </span>
        </button>

        {/* Кнопка поиска */}
        <div className="flex shrink-0 items-center pl-0.5">
          <button
            type="button"
            onClick={submit}
            aria-label="Показать варианты"
            className="grid h-[52px] w-[52px] place-items-center rounded-2xl bg-brand-600 text-white shadow-sm transition active:bg-brand-700"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="lg:hidden">
        <OptionSheet
          open={locSheet}
          title="Куда хотите?"
          options={LOCATION_OPTIONS.map((o) => ({ value: o, label: o }))}
          value={location}
          onSelect={setLocation}
          onClose={() => setLocSheet(false)}
        />
        <OptionSheet
          open={typeSheet}
          title="Тип жилья"
          options={TYPE_OPTIONS}
          value={type}
          onSelect={setType}
          onClose={() => setTypeSheet(false)}
        />
      </div>

      {/* ===== Desktop: единая горизонтальная панель ===== */}
      <div
        className={cn(
          "hidden gap-3 lg:grid",
          hero
            ? "lg:grid-cols-[1.3fr_1.35fr_1fr_1fr_auto] lg:items-end"
            : "lg:grid-cols-12",
        )}
      >
        {/* Локация */}
        <div className={hero ? "" : "lg:col-span-4"}>
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
        <div className={hero ? "" : "lg:col-span-3"}>
          <label className="label">Заезд — Выезд</label>
          <DateRangePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onChange={(next) => {
              setCheckIn(next.checkIn);
              setCheckOut(next.checkOut);
            }}
          />
        </div>

        {/* Гости */}
        <div className={hero ? "" : "lg:col-span-2"}>
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
        <div className={hero ? "" : "lg:col-span-2"}>
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
        <div className={hero ? "flex items-end" : "flex items-end lg:col-span-1"}>
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
