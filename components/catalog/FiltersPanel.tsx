"use client";

import type { Amenity, PropertyType } from "@/types/property";
import type { FilterState } from "@/lib/filters";
import {
  AMENITY_LABELS,
  FILTER_AMENITIES,
  FILTER_LOCATIONS,
  FILTER_TYPES,
  GUEST_OPTIONS,
  TYPE_LABELS,
} from "@/lib/constants";
import PriceRange from "@/components/catalog/PriceRange";
import { AMENITY_ICONS } from "@/components/ui/AmenityIcon";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-slate-100 py-4 first:border-t-0 first:pt-0">
      <h4 className="mb-3 text-sm font-bold text-ink">{title}</h4>
      {children}
    </div>
  );
}

function Check({
  checked,
  onChange,
  label,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-ink-soft">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500/30"
      />
      {icon && <span className="text-ink-muted">{icon}</span>}
      <span>{label}</span>
    </label>
  );
}

export default function FiltersPanel({
  value,
  onChange,
  onReset,
}: {
  value: FilterState;
  onChange: (next: Partial<FilterState>) => void;
  onReset: () => void;
}) {
  const toggle = <T,>(arr: T[], item: T): T[] =>
    arr.includes(item) ? arr.filter((x) => x !== item) : [...arr, item];

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h3 className="text-base font-extrabold text-ink">Фильтры</h3>
        <button
          onClick={onReset}
          className="text-sm font-semibold text-brand-600 hover:text-brand-700"
        >
          Сбросить
        </button>
      </div>

      <Section title="Расположение">
        {FILTER_LOCATIONS.map((loc) => (
          <Check
            key={loc}
            label={loc}
            checked={value.locations.includes(loc)}
            onChange={() =>
              onChange({ locations: toggle(value.locations, loc) })
            }
          />
        ))}
      </Section>

      <Section title="Цена за ночь (сом)">
        <PriceRange
          min={value.priceMin}
          max={value.priceMax}
          onChange={(n) => onChange({ priceMin: n.min, priceMax: n.max })}
        />
      </Section>

      <Section title="Количество гостей">
        <select
          value={value.guests}
          onChange={(e) => onChange({ guests: Number(e.target.value) })}
          className="input"
          aria-label="Количество гостей"
        >
          <option value={0}>Любое количество</option>
          {GUEST_OPTIONS.map((g) => (
            <option key={g} value={g}>
              {g}+ гостей
            </option>
          ))}
        </select>
      </Section>

      <Section title="Тип жилья">
        {FILTER_TYPES.map((t: PropertyType) => (
          <Check
            key={t}
            label={TYPE_LABELS[t]}
            checked={value.types.includes(t)}
            onChange={() => onChange({ types: toggle(value.types, t) })}
          />
        ))}
      </Section>

      <Section title="Удобства">
        {FILTER_AMENITIES.map((a: Amenity) => {
          const Icon = AMENITY_ICONS[a];
          return (
            <Check
              key={a}
              label={AMENITY_LABELS[a]}
              icon={<Icon className="h-4 w-4" />}
              checked={value.amenities.includes(a)}
              onChange={() => onChange({ amenities: toggle(value.amenities, a) })}
            />
          );
        })}
      </Section>
    </div>
  );
}
