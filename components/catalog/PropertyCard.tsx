import Link from "next/link";
import { Users, BedDouble, Umbrella, Wifi } from "lucide-react";
import type { Property } from "@/types/property";
import SafeImage from "@/components/ui/SafeImage";
import RatingBadge from "@/components/ui/RatingBadge";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { SHORE_LABELS } from "@/lib/constants";
import { priceLabel } from "@/lib/utils";

function bedroomsLabel(n: number): string {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return `${n} спальня`;
  if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return `${n} спальни`;
  return `${n} спален`;
}

export default function PropertyCard({ property }: { property: Property }) {
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link href={`/property/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <SafeImage
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-300 group-hover:scale-[1.04]"
          />
          <div className="absolute left-3 top-3">
            <div className="rounded-lg bg-white/95 px-1.5 py-1 shadow-soft backdrop-blur">
              <RatingBadge rating={property.rating} />
            </div>
          </div>
          <FavoriteButton id={property.id} className="absolute right-3 top-3" />
        </div>

        <div className="p-4">
          <h3 className="line-clamp-1 text-base font-bold text-ink">
            {property.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">
            {property.location} · {SHORE_LABELS[property.shore]}
          </p>

          <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-soft">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5 text-ink-muted" /> до{" "}
              {property.guests} гостей
            </span>
            <span className="inline-flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-ink-muted" />{" "}
              {bedroomsLabel(property.bedrooms)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Umbrella className="h-3.5 w-3.5 text-ink-muted" /> Пляж{" "}
              {property.distanceToBeach} м
            </span>
            {property.amenities.includes("wifi") && (
              <span className="inline-flex items-center gap-1">
                <Wifi className="h-3.5 w-3.5 text-ink-muted" /> Wi-Fi
              </span>
            )}
          </div>

          <div className="mt-4 flex items-end justify-between">
            <div>
              {property.oldPrice && (
                <span className="mr-1 text-xs text-slate-400 line-through">
                  {priceLabel(property.oldPrice)}
                </span>
              )}
              <div className="text-[11px] uppercase tracking-wide text-ink-muted">
                от
              </div>
              <div className="text-lg font-extrabold leading-tight text-ink">
                {priceLabel(property.pricePerNight)}
                <span className="text-xs font-medium text-ink-muted">
                  {" "}
                  / ночь
                </span>
              </div>
            </div>
            <span className="btn-outline pointer-events-none px-3 py-1.5 text-xs">
              Подробнее
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
