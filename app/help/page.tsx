import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Помощь",
  description: "Частые вопросы о бронировании жилья на Иссык-Куле через IK-HOUSE.",
};

const FAQ = [
  {
    q: "Как забронировать жильё?",
    a: "Выберите объект, укажите даты и количество гостей и нажмите «Забронировать». Заполните короткую форму — заявка уйдёт владельцу, и он свяжется с вами для подтверждения.",
  },
  {
    q: "Нужно ли платить онлайн?",
    a: "Нет. На данном этапе оплата происходит напрямую с владельцем. Итоговая стоимость всегда видна заранее, без скрытых доплат.",
  },
  {
    q: "Как отменить бронирование?",
    a: "Свяжитесь с владельцем по телефону или в WhatsApp — контакты указаны на странице объекта. Условия отмены зависят от конкретного объекта.",
  },
  {
    q: "Насколько точны фотографии?",
    a: "Мы стремимся показывать реальные фото. Если что-то не совпало с описанием — сообщите нам, и мы разберёмся.",
  },
  {
    q: "Можно ли приехать с детьми или животными?",
    a: "Большинство объектов подходят для семей с детьми. По поводу питомцев уточняйте у владельца перед бронированием.",
  },
];

export default function HelpPage() {
  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="text-3xl font-extrabold text-ink">Помощь и частые вопросы</h1>
        <p className="mt-2 text-ink-muted">
          Всё, что нужно знать о бронировании через IK-HOUSE.
        </p>

        <div className="mt-8 space-y-3">
          {FAQ.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-slate-200 bg-white p-5 open:shadow-card"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between font-semibold text-ink">
                {item.q}
                <span className="ml-4 text-brand-500 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-ink-soft">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
