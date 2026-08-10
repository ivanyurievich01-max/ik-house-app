import type { Property } from "@/types/property";
import Link from "next/link";
import RatingBadge from "@/components/ui/RatingBadge";
import { priceLabel } from "@/lib/utils";
import { SHORE_LABELS } from "@/lib/constants";

/**
 * Простая карта на OpenStreetMap (без API-ключа) + список объектов сбоку.
 * При наличии NEXT_PUBLIC_GOOGLE_MAPS_API_KEY можно заменить на Google Maps.
 */
export default function CatalogMap({ items }: { items: Property[] }) {
  const bbox = "76.0,42.0,78.5,42.9"; // Иссык-Куль
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik`;

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
        <iframe
          title="Карта Иссык-Куля"
          src={src}
          className="h-[300px] w-full lg:h-[640px]"
          loading="lazy"
        />
      </div>
      <div className="max-h-[640px] space-y-3 overflow-y-auto pr-1">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/property/${p.slug}`}
            className="flex gap-3 rounded-xl border border-slate-200 bg-white p-2.5 shadow-soft transition hover:border-brand-300"
          >
            <div className="min-w-0 flex-1">
              <div className="mb-1">
                <RatingBadge rating={p.rating} withLabel={false} />
              </div>
              <div className="truncate text-sm font-bold text-ink">
                {p.title}
              </div>
              <div className="truncate text-xs text-ink-muted">
                {p.location} · {SHORE_LABELS[p.shore]}
              </div>
              <div className="mt-1 text-sm font-extrabold text-ink">
                от {priceLabel(p.pricePerNight)}
                <span className="text-xs font-medium text-ink-muted"> / ночь</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
