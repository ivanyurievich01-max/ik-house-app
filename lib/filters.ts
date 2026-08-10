import type { Amenity, Property, PropertyType } from "@/types/property";
import { SHORE_LABELS } from "@/lib/constants";

export type SortKey =
  | "recommended"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "popular";

export interface FilterState {
  locations: string[]; // значения из FILTER_LOCATIONS (метки берегов или населённые пункты)
  types: PropertyType[];
  amenities: Amenity[];
  priceMin: number;
  priceMax: number;
  guests: number; // минимум гостей, 0 = любое
  sort: SortKey;
}

export const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "recommended", label: "Сначала рекомендуемые" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "rating", label: "По рейтингу" },
  { value: "popular", label: "По популярности" },
];

/** Сопоставляет фильтр-локацию (метка) с объектом */
function matchesLocation(p: Property, locations: string[]): boolean {
  if (locations.length === 0) return true;
  return locations.some((loc) => {
    if (loc === SHORE_LABELS.north) return p.shore === "north";
    if (loc === SHORE_LABELS.south) return p.shore === "south";
    return p.location === loc;
  });
}

export function applyFilters(
  properties: Property[],
  f: FilterState,
): Property[] {
  const filtered = properties.filter((p) => {
    if (!matchesLocation(p, f.locations)) return false;
    if (f.types.length > 0 && !f.types.includes(p.type)) return false;
    if (p.pricePerNight < f.priceMin || p.pricePerNight > f.priceMax)
      return false;
    if (f.guests > 0 && p.guests < f.guests) return false;
    if (f.amenities.length > 0) {
      const has = f.amenities.every((a) => p.amenities.includes(a));
      if (!has) return false;
    }
    return true;
  });

  return sortProperties(filtered, f.sort);
}

export function sortProperties(list: Property[], sort: SortKey): Property[] {
  const arr = [...list];
  switch (sort) {
    case "price_asc":
      return arr.sort((a, b) => a.pricePerNight - b.pricePerNight);
    case "price_desc":
      return arr.sort((a, b) => b.pricePerNight - a.pricePerNight);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating);
    case "popular":
      return arr.sort(
        (a, b) => Number(b.popular) - Number(a.popular) || b.rating - a.rating,
      );
    case "recommended":
    default:
      return arr.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          b.rating - a.rating ||
          b.reviewsCount - a.reviewsCount,
      );
  }
}
