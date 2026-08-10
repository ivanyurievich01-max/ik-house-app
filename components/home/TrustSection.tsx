import {
  ShieldCheck,
  PhoneCall,
  Wallet,
  Headphones,
  Star,
  Clock,
} from "lucide-react";

const ITEMS = [
  {
    icon: ShieldCheck,
    title: "Проверенные объекты",
    text: "Каждый объект проходит базовую проверку перед публикацией.",
  },
  {
    icon: PhoneCall,
    title: "Прямой контакт",
    text: "Можно связаться с владельцем напрямую по телефону или в WhatsApp.",
  },
  {
    icon: Wallet,
    title: "Без скрытых условий",
    text: "Итоговая стоимость видна заранее — никаких доплат на месте.",
  },
  {
    icon: Headphones,
    title: "Поддержка",
    text: "Помогаем решить любые вопросы по бронированию до и во время поездки.",
  },
  {
    icon: Star,
    title: "Реальные отзывы",
    text: "Отзывы оставляют гости после реального проживания.",
  },
  {
    icon: Clock,
    title: "Удобное бронирование",
    text: "Заявка на бронирование занимает меньше минуты.",
  },
];

export default function TrustSection() {
  return (
    <section className="bg-white py-14">
      <div className="container-page">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Почему бронируют через IK-HOUSE
          </h2>
          <p className="mt-1 text-ink-muted">
            Мы делаем отдых на Иссык-Куле простым и безопасным.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ITEMS.map((it) => (
            <div
              key={it.title}
              className="flex gap-4 rounded-2xl border border-slate-200 p-5 transition hover:border-brand-200 hover:shadow-card"
            >
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <it.icon className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-ink">{it.title}</h3>
                <p className="mt-1 text-sm text-ink-muted">{it.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
