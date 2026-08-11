import Link from "next/link";
import { ArrowRight, Star, MapPin } from "lucide-react";
import type { Property } from "@/types/property";
import SafeImage from "@/components/ui/SafeImage";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { priceLabel, seededInt } from "@/lib/utils";

/* Компактные image-forward карточки для главной (как в референсе).
 * Полные информативные карточки остаются в каталоге. */

const BADGES = ["Суперхит", "Быстро бронируют", "Тихое место", "Для компании"];
const BADGE_STYLE = [
  "bg-amber-500",
  "bg-brand-600",
  "bg-emerald-600",
  "bg-violet-600",
] as const;

function HomeCard({ property, index }: { property: Property; index: number }) {
  const b = index < 4 ? index : seededInt(property.id + "b", 0, 3);
  return (
    <article className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-200 hover:-translate-y-0.5 hover:shadow-card-hover">
      <Link href={`/property/${property.slug}`} className="block">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <SafeImage
            src={property.images[0]}
            alt={property.title}
            fill
            sizes="(max-width: 640px) 85vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition duration-300 group-hover:scale-[1.05]"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/60 to-transparent" />
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-bold text-white shadow-soft ${BADGE_STYLE[b % 4]}`}
          >
            {BADGES[b % 4]}
          </span>
          <FavoriteButton id={property.id} className="absolute right-3 top-3" />
          <span className="absolute bottom-2.5 left-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-xs font-bold text-ink shadow-soft">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {property.rating.toFixed(1)}{" "}
            <span className="font-medium text-ink-muted">
              ({property.reviewsCount})
            </span>
          </span>
        </div>

        <div className="p-3.5">
          <h3 className="line-clamp-1 text-[15px] font-bold text-ink">
            {property.title}
          </h3>
          <p className="mt-0.5 line-clamp-1 inline-flex items-center gap-1 text-[13px] text-ink-muted">
            <MapPin className="h-3.5 w-3.5 shrink-0" /> {property.location}
          </p>
          <p className="mt-1.5 text-[15px] font-extrabold text-ink">
            {priceLabel(property.pricePerNight)}{" "}
            <span className="text-xs font-medium text-ink-muted">/ ночь</span>
          </p>
        </div>
      </Link>
    </article>
  );
}

export default function PopularSection({ items }: { items: Property[] }) {
  const shown = items.slice(0, 4);
  return (
    <section className="container-page py-10 sm:py-12">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Популярные варианты
          </h2>
          <p className="mt-1 text-ink-muted">
            Объекты, которые чаще всего бронируют гости.
          </p>
        </div>
        <Link
          href="/catalog"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-2.5 sm:inline-flex"
        >
          Все варианты <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Mobile: горизонтальная snap-карусель; Desktop: 4 в ряд */}
      <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-4">
        {shown.map((p, i) => (
          <div
            key={p.id}
            className="w-[82%] shrink-0 snap-start sm:w-auto sm:shrink"
          >
            <HomeCard property={p} index={i} />
          </div>
        ))}
      </div>

      <div className="mt-5 sm:hidden">
        <Link href="/catalog" className="btn-outline w-full">
          Все варианты <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
