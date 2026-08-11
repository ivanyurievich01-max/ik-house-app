import Link from "next/link";
import { ArrowRight, Home, Star, MapPin } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";

/* Premium-баннер вместо агрессивного countdown.
 * Статистика ЧЕСТНАЯ — считается из реальных данных каталога (см. app/page.tsx). */

export type BannerStats = {
  objects: number;
  locations: number;
  avgRating: number | null;
};

export default function SeasonalBanner({ stats }: { stats: BannerStats }) {
  const items = [
    {
      icon: Home,
      value: String(stats.objects),
      label: stats.objects === 1 ? "объект на платформе" : "объекта на платформе",
    },
    {
      icon: MapPin,
      value: String(stats.locations),
      label: "локаций на озере",
    },
    ...(stats.avgRating
      ? [
          {
            icon: Star,
            value: stats.avgRating.toFixed(1),
            label: "средний рейтинг",
          },
        ]
      : []),
  ];

  return (
    <section className="container-page py-10 sm:py-12">
      <div className="relative overflow-hidden rounded-2xl shadow-card-hover">
        <SafeImage
          src="/images/home/summer-banner.webp"
          alt="Отдых у костра на берегу Иссык-Куля"
          fill
          sizes="100vw"
          className="object-cover object-[60%_center]"
        />
        {/* Navy-overlay: слева темнее под текст, люди у костра остаются видны */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1630]/90 via-[#0d1b3a]/60 to-[#0b1630]/45" />

        <div className="relative flex flex-col justify-between gap-8 px-6 py-9 text-white sm:px-10 sm:py-11 lg:flex-row lg:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
              Лето короткое —<br />
              лучшие места быстро разбирают
            </h2>
            <p className="mt-2 text-white/80">
              Забронируйте жильё заранее и наслаждайтесь каждым моментом на
              Иссык-Куле.
            </p>
            <Link
              href="/catalog"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-brand-700 transition hover:gap-3"
            >
              Найти идеальный отдых <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid shrink-0 grid-cols-3 gap-4 sm:gap-8 lg:gap-10">
            {items.map((s) => (
              <div key={s.label} className="text-center lg:text-left">
                <s.icon className="mx-auto mb-1.5 h-5 w-5 text-white/70 lg:mx-0" />
                <div className="text-2xl font-extrabold sm:text-3xl">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs text-white/70 sm:text-sm">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
