"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  SlidersHorizontal,
  LayoutGrid,
  Map as MapIcon,
  X,
  ChevronRight,
} from "lucide-react";
import type { Property } from "@/types/property";
import type { FilterState } from "@/lib/filters";
import { applyFilters, SORT_OPTIONS } from "@/lib/filters";
import { defaultFilters, parseFilters, serializeFilters } from "@/lib/url";
import FiltersPanel from "@/components/catalog/FiltersPanel";
import PropertyCard from "@/components/catalog/PropertyCard";
import CatalogMap from "@/components/catalog/CatalogMap";
import { cn } from "@/lib/utils";

function paramsToObj(sp: URLSearchParams): Record<string, string> {
  return Object.fromEntries(sp.entries());
}

function countActive(f: FilterState): number {
  return (
    f.locations.length +
    f.types.length +
    f.amenities.length +
    (f.guests > 0 ? 1 : 0) +
    (f.priceMin > defaultFilters().priceMin ? 1 : 0) +
    (f.priceMax < defaultFilters().priceMax ? 1 : 0)
  );
}

function variantsLabel(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} вариант`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20))
    return `${n} варианта`;
  return `${n} вариантов`;
}

export default function CatalogClient({ properties }: { properties: Property[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const spString = searchParams.toString();

  const [filters, setFilters] = useState<FilterState>(() =>
    parseFilters(paramsToObj(searchParams)),
  );
  const [view, setView] = useState<"list" | "map">("list");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const skipSync = useRef(false);

  // Синхронизация state -> URL
  useEffect(() => {
    const qs = serializeFilters(filters);
    if (qs !== spString) {
      skipSync.current = true;
      router.replace(qs ? `/catalog?${qs}` : "/catalog", { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  // Синхронизация URL -> state (переходы по ссылкам в шапке и т.п.)
  useEffect(() => {
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    setFilters(parseFilters(paramsToObj(searchParams)));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spString]);

  const results = useMemo(
    () => applyFilters(properties, filters),
    [properties, filters],
  );

  const update = (patch: Partial<FilterState>) =>
    setFilters((prev) => ({ ...prev, ...patch }));
  const reset = () => setFilters(defaultFilters());

  const active = countActive(filters);
  const checkin = searchParams.get("checkin");
  const checkout = searchParams.get("checkout");

  return (
    <div className="container-page py-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-ink-muted">
        <Link href="/" className="hover:text-brand-600">
          Главная
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-ink-soft">Жильё</span>
      </nav>

      <div className="mt-3 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Жильё на Иссык-Куле
          </h1>
          <p className="mt-1 text-ink-muted">
            Коттеджи, гостевые дома и пансионаты для семьи, друзей и компаний.
          </p>
          {checkin && checkout && (
            <p className="mt-1 text-sm text-brand-600">
              Даты: {checkin} — {checkout}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden text-sm text-ink-muted sm:block">
            Сортировка:
          </label>
          <select
            value={filters.sort}
            onChange={(e) => update({ sort: e.target.value as FilterState["sort"] })}
            className="input w-auto py-2 text-sm"
            aria-label="Сортировка"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <div className="hidden rounded-xl border border-slate-300 p-0.5 sm:flex">
            <button
              onClick={() => setView("list")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
                view === "list"
                  ? "bg-brand-500 text-white"
                  : "text-ink-soft hover:bg-slate-100",
              )}
            >
              <LayoutGrid className="h-4 w-4" /> Список
            </button>
            <button
              onClick={() => setView("map")}
              className={cn(
                "flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium",
                view === "map"
                  ? "bg-brand-500 text-white"
                  : "text-ink-soft hover:bg-slate-100",
              )}
            >
              <MapIcon className="h-4 w-4" /> Карта
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 flex gap-6">
        {/* Sidebar desktop */}
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-20 rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <FiltersPanel value={filters} onChange={update} onReset={reset} />
          </div>
        </aside>

        {/* Результаты */}
        <div className="min-w-0 flex-1">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-ink-soft">
              Найдено {variantsLabel(results.length)}
            </p>
            <button
              onClick={() => setDrawerOpen(true)}
              className="btn-outline px-3 py-2 lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Фильтры
              {active > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1 text-[11px] font-bold text-white">
                  {active}
                </span>
              )}
            </button>
          </div>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
              <p className="text-lg font-bold text-ink">
                По выбранным параметрам жильё не найдено
              </p>
              <p className="mt-1 text-ink-muted">
                Попробуйте изменить даты или параметры поиска.
              </p>
              <button onClick={reset} className="btn-primary mt-5">
                Сбросить фильтры
              </button>
            </div>
          ) : view === "map" ? (
            <CatalogMap items={results} />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Мобильный drawer с фильтрами */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-2xl bg-white p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-extrabold">Фильтры</h3>
              <button
                onClick={() => setDrawerOpen(false)}
                aria-label="Закрыть"
                className="grid h-9 w-9 place-items-center rounded-lg hover:bg-slate-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <FiltersPanel value={filters} onChange={update} onReset={reset} />
            <div className="sticky bottom-0 mt-4 bg-white pt-2">
              <button
                onClick={() => setDrawerOpen(false)}
                className="btn-cta w-full"
              >
                Показать {variantsLabel(results.length)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
