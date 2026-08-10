import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, MapPin, HeartHandshake } from "lucide-react";

export const metadata: Metadata = {
  title: "О нас",
  description:
    "IK-HOUSE — сервис поиска и бронирования жилья на Иссык-Куле напрямую от владельцев.",
};

export default function AboutPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold text-ink">О сервисе IK-HOUSE</h1>
        <p className="mt-4 text-lg text-ink-soft">
          IK-HOUSE помогает быстро найти и забронировать жильё на Иссык-Куле —
          от уютных гостевых домов до вилл с бассейном. Мы объединяем
          проверенных владельцев и гостей на одной удобной платформе.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Доверие",
              text: "Проверяем объекты и показываем реальные отзывы гостей.",
            },
            {
              icon: MapPin,
              title: "Местный опыт",
              text: "Знаем оба берега озера и подскажем лучшие места.",
            },
            {
              icon: HeartHandshake,
              title: "Честность",
              text: "Прямой контакт с владельцем и прозрачные цены.",
            },
          ].map((it) => (
            <div
              key={it.title}
              className="rounded-2xl border border-slate-200 p-5"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <it.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-3 font-bold text-ink">{it.title}</h3>
              <p className="mt-1 text-sm text-ink-muted">{it.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-2xl bg-gradient-to-r from-brand-600 to-lake-600 p-8 text-white">
          <h2 className="text-xl font-extrabold">Готовы к отдыху на Иссык-Куле?</h2>
          <p className="mt-1 text-white/85">
            Подберите жильё на любой вкус и бюджет за пару минут.
          </p>
          <Link
            href="/catalog"
            className="mt-4 inline-block rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-brand-700"
          >
            Смотреть каталог
          </Link>
        </div>
      </div>
    </div>
  );
}
