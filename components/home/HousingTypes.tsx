import Link from "next/link";
import { ArrowRight, Building2, Home, Gem } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { priceLabel } from "@/lib/utils";

/* Категории соответствуют реальным значениям PropertyType в БД
 * (resort / guesthouse+cottage / villa+apartment) — все ссылки рабочие.
 * Юрт/глэмпинга в базе пока нет, поэтому такой карточки сознательно нет.
 * Mobile (утверждённый макет): 3 компактные карточки в одну строку;
 * на очень узких экранах (<390px) — горизонтальная snap-карусель. */

export type HousingTypeCard = {
  key: string;
  href: string;
  title: string;
  desc: string;
  minPrice: number | null;
  cta: string;
  img: string;
  alt: string;
  icon: "resort" | "house" | "villa";
  badge?: string;
};

const ICONS = { resort: Building2, house: Home, villa: Gem } as const;

export default function HousingTypes({ cards }: { cards: HousingTypeCard[] }) {
  return (
    <section className="container-page pb-10 sm:pb-12">
      <div className="mb-3.5 flex items-end justify-between md:mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-ink sm:text-3xl">
            Выберите тип жилья
          </h2>
          <p className="mt-1 hidden text-ink-muted md:block">
            От пансионата «всё включено» до виллы у самого берега.
          </p>
        </div>
        <Link
          href="/catalog"
          className="inline-flex shrink-0 items-center gap-1 text-[13px] font-semibold text-brand-600 hover:gap-2 sm:gap-1.5 sm:text-sm"
        >
          Все варианты <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </Link>
      </div>

      <div className="-mx-4 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-4 pb-1 min-[390px]:mx-0 min-[390px]:grid min-[390px]:grid-cols-3 min-[390px]:overflow-visible min-[390px]:px-0 min-[390px]:pb-0 md:gap-5">
        {cards.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <Link
              key={c.key}
              href={c.href}
              className="group relative h-[230px] w-[46%] shrink-0 snap-start overflow-hidden rounded-2xl shadow-card min-[390px]:w-auto min-[390px]:shrink md:h-[340px]"
            >
              <SafeImage
                src={c.img}
                alt={c.alt}
                fill
                sizes="(max-width: 768px) 46vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/10" />
              {c.badge && (
                <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[9px] font-bold text-white shadow-soft md:left-4 md:top-4 md:px-2.5 md:py-1 md:text-xs">
                  {c.badge}
                </span>
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-2.5 md:p-5">
                <span className="mb-1.5 grid h-8 w-8 place-items-center rounded-full bg-white/95 text-ink shadow-soft md:mb-2 md:h-11 md:w-11">
                  <Icon className="h-4 w-4 md:h-5 md:w-5" />
                </span>
                <h3 className="text-[13px] font-extrabold leading-tight text-white md:text-xl">
                  {c.title}
                </h3>
                <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/85 md:mt-1 md:text-sm">
                  {c.desc}
                </p>
                {c.minPrice !== null && (
                  <p className="mt-1 text-[12px] font-bold text-white md:mt-1.5 md:text-sm">
                    от {priceLabel(c.minPrice)}{" "}
                    <span className="font-medium text-white/75">/ ночь</span>
                  </p>
                )}
                <span className="mt-3 hidden w-fit items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-sm font-semibold text-ink transition group-hover:gap-2.5 md:inline-flex">
                  {c.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
