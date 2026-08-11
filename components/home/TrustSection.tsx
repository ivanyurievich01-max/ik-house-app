import {
  ShieldCheck,
  BadgeCheck,
  Headphones,
  Zap,
  Wallet,
} from "lucide-react";

/* Компактный горизонтальный блок преимуществ (как в референсе).
 * Формулировки честные: не обещаем возврат денег — обещаем помощь. */
const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Проверяем лично",
    text: "Каждый объект мы проверяем сами",
  },
  {
    icon: BadgeCheck,
    title: "Гарантия заселения",
    text: "Поможем решить проблему с заселением",
  },
  {
    icon: Headphones,
    title: "Поддержка 24/7",
    text: "Всегда на связи — до и во время отдыха",
  },
  {
    icon: Zap,
    title: "Быстрое бронирование",
    text: "Удобный сайт и быстрая заявка",
  },
  {
    icon: Wallet,
    title: "Без скрытых платежей",
    text: "Цена на сайте понятна заранее",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-brand-50/60 py-8 sm:py-10">
      <div className="container-page">
        <h2 className="mb-6 text-center text-2xl font-extrabold text-ink sm:text-3xl">
          Почему выбирают IK-HOUSE?
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 lg:grid-cols-5">
          {ITEMS.map((it) => (
            <div key={it.title} className="flex flex-col items-center text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-white text-brand-600 shadow-soft">
                <it.icon className="h-5.5 w-5.5 h-[22px] w-[22px]" />
              </span>
              <h3 className="mt-2.5 text-sm font-bold leading-tight text-ink">
                {it.title}
              </h3>
              <p className="mt-1 text-xs leading-snug text-ink-muted">
                {it.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
