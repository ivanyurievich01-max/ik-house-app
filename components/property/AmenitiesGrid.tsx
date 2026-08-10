"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { Amenity } from "@/types/property";
import { AMENITY_LABELS } from "@/lib/constants";
import { AMENITY_ICONS } from "@/components/ui/AmenityIcon";

const ALL_AMENITIES = Object.keys(AMENITY_LABELS) as Amenity[];

export default function AmenitiesGrid({
  amenities,
}: {
  amenities: Amenity[];
}) {
  const [showAll, setShowAll] = useState(false);
  const has = new Set(amenities);

  // Показываем сначала имеющиеся удобства, затем (по кнопке) полный список
  const primary = amenities.slice(0, 8);
  const list = showAll ? ALL_AMENITIES : primary;

  return (
    <div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {list.map((a) => {
          const Icon = AMENITY_ICONS[a];
          const available = has.has(a);
          return (
            <div
              key={a}
              className={
                "flex items-center gap-2.5 text-sm " +
                (available ? "text-ink-soft" : "text-slate-300 line-through")
              }
            >
              <Icon className="h-5 w-5 shrink-0 text-brand-500" />
              <span>{AMENITY_LABELS[a]}</span>
              {available && (
                <Check className="ml-auto h-4 w-4 text-emerald-500" />
              )}
            </div>
          );
        })}
      </div>

      {amenities.length > 8 || !showAll ? (
        <button
          onClick={() => setShowAll((v) => !v)}
          className="btn-outline mt-4 px-4 py-2 text-sm"
        >
          {showAll ? "Скрыть" : "Показать все удобства"}
        </button>
      ) : null}
    </div>
  );
}
