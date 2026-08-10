import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

const REVIEWS = [
  {
    name: "Анна",
    city: "Алматы",
    rating: 5,
    text: "Быстро нашли хороший коттедж в Чолпон-Ате. Фотографии соответствовали реальности, хозяин быстро подтвердил бронь.",
    stay: "Коттедж «Лагуна»",
  },
  {
    name: "Дмитрий",
    city: "Бишкек",
    rating: 5,
    text: "Отличное место для семьи. До пляжа пара минут, всё чисто и уютно. Обязательно вернёмся следующим летом.",
    stay: "Lake House",
  },
  {
    name: "Салтанат",
    city: "Астана",
    rating: 5,
    text: "Очень тихое и красивое место на южном берегу. Вид на горы и озеро — как на открытке. Всё как на фото.",
    stay: "Alpine Lake House",
  },
  {
    name: "Игорь",
    city: "Караганда",
    rating: 4,
    text: "Хорошее соотношение цены и качества. Бассейн, парковка, приветливые хозяева. Рекомендую пансионат.",
    stay: "Пансионат «Aurora»",
  },
];

export default function ReviewsSection() {
  return (
    <section className="container-page py-14">
      <div className="mb-8 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Отзывы гостей
          </h2>
          <p className="mt-1 text-ink-muted">
            Что говорят те, кто уже отдохнул с IK-HOUSE.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-xl bg-white px-4 py-2 shadow-card">
          <span className="text-2xl font-extrabold text-ink">4.8</span>
          <div className="text-xs text-ink-muted">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            средняя оценка
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {REVIEWS.map((r) => (
          <figure
            key={r.name}
            className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
          >
            <div className="mb-3 flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "h-4 w-4",
                    i < r.rating
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200",
                  )}
                />
              ))}
            </div>
            <blockquote className="flex-1 text-sm text-ink-soft">
              «{r.text}»
            </blockquote>
            <figcaption className="mt-4 border-t border-slate-100 pt-3">
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {r.name[0]}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">
                    {r.name}, {r.city}
                  </div>
                  <div className="text-xs text-ink-muted">{r.stay}</div>
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
