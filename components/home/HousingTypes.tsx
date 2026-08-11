import Link from "next/link";
import { ArrowRight, Building2, Home, Gem } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import { priceLabel } from "@/lib/utils";

/* Категории соответствуют реальным значениям PropertyType в БД
 * (resort / guesthouse+cottage / villa+apartment) — все ссылки рабочие.
 * Юрт/глэмпинга в базе пока нет, поэтому такой карточки сознательно нет. */

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
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Выберите тип жилья
          </h2>
          <p className="mt-1 text-ink-muted">
            От пансионата «всё включено» до виллы у самого берега.
          </p>
        </div>
        <Link
          href="/catalog"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-2.5 sm:inline-flex"
        >
          Все варианты <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {cards.map((c) => {
          const Icon = ICONS[c.icon];
          return (
            <Link
              key={c.key}
              href={c.href}
              className="group relative h-[300px] overflow-hidden rounded-2xl shadow-card sm:h-[340px]"
            >
              <SafeImage
                src={c.img}
                alt={c.alt}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-ink/10" />
              {c.badge && (
                <span className="absolute left-4 top-4 rounded-full bg-amber-500 px-2.5 py-1 text-xs font-bold text-white shadow-soft">
                  {c.badge}
                </span>
              )}
              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="mb-2 grid h-11 w-11 place-items-center rounded-full bg-white/95 text-ink shadow-soft">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="text-xl font-extrabold text-white">{c.title}</h3>
                <p className="mt-1 text-sm text-white/85">{c.desc}</p>
                {c.minPrice !== null && (
                  <p className="mt-1.5 text-sm font-bold text-white">
                    от {priceLabel(c.minPrice)}{" "}
                    <span className="font-medium text-white/75">/ ночь</span>
                  </p>
                )}
                <span className="mt-3 inline-flex w-fit items-center gap-1.5 rounded-xl bg-white/95 px-3.5 py-2 text-sm font-semibold text-ink transition group-hover:gap-2.5">
                  {c.cta} <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      <div className="mt-5 sm:hidden">
        <Link href="/catalog" className="btn-outline w-full">
          Все варианты <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
