import type { Amenity, PropertyType } from "@/types/property";
import type { FilterState, SortKey } from "@/lib/filters";
import {
  FILTER_AMENITIES,
  FILTER_TYPES,
  PRICE_MAX,
  PRICE_MIN,
  SHORE_LABELS,
} from "@/lib/constants";

const SORT_KEYS: SortKey[] = [
  "recommended",
  "price_asc",
  "price_desc",
  "rating",
  "popular",
];

export function defaultFilters(): FilterState {
  return {
    locations: [],
    types: [],
    amenities: [],
    priceMin: PRICE_MIN,
    priceMax: PRICE_MAX,
    guests: 0,
    sort: "recommended",
  };
}

type SP = Record<string, string | string[] | undefined>;

function first(v: string | string[] | undefined): string | undefined {
  return Array.isArray(v) ? v[0] : v;
}

function list(v: string | string[] | undefined): string[] {
  const raw = first(v);
  if (!raw) return [];
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

export function parseFilters(sp: SP): FilterState {
  const f = defaultFilters();

  // Берег из поиска на главной
  const shore = first(sp.shore);
  if (shore === "south") f.locations.push(SHORE_LABELS.south);
  if (shore === "north") f.locations.push(SHORE_LABELS.north);

  // Явные локации (label из FILTER_LOCATIONS) — из поиска (location) или round-trip (loc)
  for (const loc of [...list(sp.location), ...list(sp.loc)]) {
    if (!f.locations.includes(loc)) f.locations.push(loc);
  }

  const types = list(sp.type).filter((t): t is PropertyType =>
    FILTER_TYPES.includes(t as PropertyType),
  );
  f.types = types as PropertyType[];

  const am = list(sp.am).filter((a): a is Amenity =>
    FILTER_AMENITIES.includes(a as Amenity),
  );
  f.amenities = am as Amenity[];

  const pmin = Number(first(sp.pmin));
  const pmax = Number(first(sp.pmax));
  if (!Number.isNaN(pmin) && pmin >= PRICE_MIN) f.priceMin = pmin;
  if (!Number.isNaN(pmax) && pmax <= PRICE_MAX && pmax > 0) f.priceMax = pmax;

  const guests = Number(first(sp.guests));
  if (!Number.isNaN(guests) && guests > 0) f.guests = guests;

  const sort = first(sp.sort) as SortKey | undefined;
  if (sort && SORT_KEYS.includes(sort)) f.sort = sort;

  return f;
}

export function serializeFilters(f: FilterState): string {
  const p = new URLSearchParams();
  if (f.locations.length) p.set("loc", f.locations.join(","));
  if (f.types.length) p.set("type", f.types.join(","));
  if (f.amenities.length) p.set("am", f.amenities.join(","));
  if (f.priceMin > PRICE_MIN) p.set("pmin", String(f.priceMin));
  if (f.priceMax < PRICE_MAX) p.set("pmax", String(f.priceMax));
  if (f.guests > 0) p.set("guests", String(f.guests));
  if (f.sort !== "recommended") p.set("sort", f.sort);
  return p.toString();
}
