"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Calendar,
  ArrowLeft,
  MessageCircle,
} from "lucide-react";
import type { Property } from "@/types/property";
import { bookingSchema, type BookingFormValues } from "@/lib/validation";
import { calcPrice } from "@/lib/pricing";
import SafeImage from "@/components/ui/SafeImage";
import {
  formatDateHuman,
  formatSom,
  priceLabel,
  pluralNights,
  toISODate,
  todayISO,
} from "@/lib/utils";
import { SHORE_LABELS } from "@/lib/constants";

function nextDay(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return toISODate(d);
}

type Status = "idle" | "submitting" | "success" | "error";

export type BookingPrefill = {
  name: string;
  phone: string;
  email: string;
  isAuthed: boolean;
} | null;

export default function BookingForm({
  property,
  prefill = null,
}: {
  property: Property;
  prefill?: BookingPrefill;
}) {
  const today = todayISO();
  const sp = useSearchParams();
  const guestsParam = Number(sp.get("guests"));
  const defaults = {
    checkIn: sp.get("checkin") ?? "",
    checkOut: sp.get("checkout") ?? "",
    guests: !Number.isNaN(guestsParam) && guestsParam > 0 ? guestsParam : 2,
  };
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [waLink, setWaLink] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: prefill?.name ?? "",
      phone: prefill?.phone ?? "",
      email: prefill?.email ?? "",
      checkIn: defaults.checkIn || "",
      checkOut: defaults.checkOut || "",
      guests: defaults.guests || 2,
      comment: "",
    },
  });

  const checkIn = watch("checkIn");
  const checkOut = watch("checkOut");
  const breakdown = calcPrice(property.pricePerNight, checkIn, checkOut);

  function buildWaLink(values: BookingFormValues, total: number, id: string) {
    const text = encodeURIComponent(
      [
        `Здравствуйте! Заявка на бронирование через IK-HOUSE (№ ${id}).`,
        `Объект: ${property.title}`,
        `Даты: ${formatDateHuman(values.checkIn)} — ${formatDateHuman(values.checkOut)}`,
        `Гостей: ${values.guests}`,
        `Итого: ${formatSom(total)} сом`,
        `Имя: ${values.name}`,
        `Телефон: ${values.phone}`,
        values.comment ? `Комментарий: ${values.comment}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    );
    return `https://wa.me/${property.owner.whatsapp}?text=${text}`;
  }

  async function onSubmit(values: BookingFormValues) {
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          propertyId: property.id,
          name: values.name,
          phone: values.phone,
          email: values.email ?? "",
          checkIn: values.checkIn,
          checkOut: values.checkOut,
          guests: values.guests,
          comment: values.comment ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        throw new Error(data.error || "Ошибка отправки");
      }
      // Итоговая стоимость рассчитана на сервере
      setBookingId(data.bookingId);
      setWaLink(buildWaLink(values, data.totalPrice, data.bookingId));
      setStatus("success");
    } catch (e) {
      setErrorMsg(
        e instanceof Error && e.message !== "Failed to fetch"
          ? e.message
          : "Не удалось отправить заявку. Проверьте соединение и попробуйте ещё раз.",
      );
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-card">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-9 w-9 text-emerald-600" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          Заявка отправлена
        </h1>
        <p className="mt-2 text-ink-soft">
          Мы передали заявку владельцу. С вами свяжутся для подтверждения
          бронирования.
        </p>
        <div className="mt-4 inline-block rounded-xl bg-slate-100 px-4 py-2 text-sm font-semibold text-ink">
          Номер заявки: {bookingId}
        </div>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-emerald-600"
          >
            <MessageCircle className="h-4 w-4" /> Подтвердить в WhatsApp с владельцем
          </a>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link href={`/property/${property.slug}`} className="btn-outline">
            Вернуться к объекту
          </Link>
          <Link href="/catalog" className="btn-primary">
            Смотреть другое жильё
          </Link>
        </div>

        {prefill?.isAuthed ? (
          <p className="mt-5 text-sm text-ink-muted">
            Заявка появилась в разделе{" "}
            <Link
              href="/account/bookings"
              className="font-semibold text-brand-600 hover:underline"
            >
              Мои заявки
            </Link>
            {" "}— там вы сможете отслеживать её статус.
          </p>
        ) : (
          <div className="mt-6 rounded-2xl bg-brand-50 p-5 text-left">
            <div className="font-bold text-ink">
              Создайте аккаунт, чтобы:
            </div>
            <ul className="mt-2 space-y-1 text-sm text-ink-soft">
              <li>— отслеживать статус заявки;</li>
              <li>— сохранять избранное;</li>
              <li>— быстрее бронировать в следующий раз.</li>
            </ul>
            <Link
              href={`/auth/register?name=${encodeURIComponent(getValues("name") ?? "")}&phone=${encodeURIComponent(getValues("phone") ?? "")}&email=${encodeURIComponent(getValues("email") ?? "")}`}
              className="btn-primary mt-4"
            >
              Создать аккаунт
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
      {/* Форма */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
      >
        <Link
          href={`/property/${property.slug}`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> Назад к объекту
        </Link>
        <h1 className="text-xl font-extrabold text-ink">Бронирование</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Заполните форму — заявка займёт меньше минуты.
        </p>

        <div className="mt-5 space-y-4">
          <div>
            <label className="label" htmlFor="name">
              Имя
            </label>
            <input
              id="name"
              {...register("name")}
              className="input"
              placeholder="Как к вам обращаться"
            />
            {errors.name && (
              <p className="mt-1 text-xs text-rose-500">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="phone">
              Телефон
            </label>
            <input
              id="phone"
              {...register("phone")}
              className="input"
              placeholder="+996 555 123 456"
              inputMode="tel"
            />
            {errors.phone && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.phone.message}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="email">
              Email <span className="text-ink-muted">(необязательно)</span>
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="input"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label" htmlFor="checkIn">
                Дата заезда
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  id="checkIn"
                  type="date"
                  min={today}
                  {...register("checkIn", {
                    onChange: (e) => {
                      const v = e.target.value;
                      if (v && (!checkOut || checkOut <= v)) {
                        setValue("checkOut", nextDay(v), {
                          shouldValidate: true,
                        });
                      }
                    },
                  })}
                  className="input pl-8"
                />
              </div>
              {errors.checkIn && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.checkIn.message}
                </p>
              )}
            </div>
            <div>
              <label className="label" htmlFor="checkOut">
                Дата выезда
              </label>
              <div className="relative">
                <Calendar className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
                <input
                  id="checkOut"
                  type="date"
                  min={checkIn ? nextDay(checkIn) : nextDay(today)}
                  {...register("checkOut")}
                  className="input pl-8"
                />
              </div>
              {errors.checkOut && (
                <p className="mt-1 text-xs text-rose-500">
                  {errors.checkOut.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="label" htmlFor="guests">
              Гости
            </label>
            <select
              id="guests"
              {...register("guests", { valueAsNumber: true })}
              className="input"
            >
              {Array.from({ length: property.guests }).map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
            {errors.guests && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.guests.message}
              </p>
            )}
          </div>

          <div>
            <label className="label" htmlFor="comment">
              Комментарий (необязательно)
            </label>
            <textarea
              id="comment"
              rows={3}
              {...register("comment")}
              className="input resize-none"
              placeholder="Пожелания, время заезда, вопросы владельцу…"
            />
            {errors.comment && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.comment.message}
              </p>
            )}
          </div>
        </div>

        {status === "error" && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {status === "error" && errorMsg && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {errorMsg}
          </div>
        )}

        <button
          type="submit"
          disabled={status === "submitting"}
          className="btn-cta mt-5 w-full text-base"
        >
          {status === "submitting" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Отправляем заявку…
            </>
          ) : (
            "Отправить заявку"
          )}
        </button>
        <p className="mt-2 text-center text-xs text-ink-muted">
          Нажимая кнопку, вы соглашаетесь на обработку данных для бронирования.
        </p>
      </form>

      {/* Сводка по объекту */}
      <aside>
        <div className="card sticky top-20 overflow-hidden">
          <div className="relative h-40 w-full">
            <SafeImage
              src={property.images[0]}
              alt={property.title}
              fill
              sizes="360px"
              className="object-cover"
            />
          </div>
          <div className="p-5">
            <h2 className="font-bold text-ink">{property.title}</h2>
            <p className="text-sm text-ink-muted">
              {property.location} · {SHORE_LABELS[property.shore]}
            </p>

            <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>Цена за ночь</span>
                <span>{priceLabel(property.pricePerNight)}</span>
              </div>
              {breakdown.nights > 0 ? (
                <>
                  <div className="flex justify-between text-ink-soft">
                    <span>
                      {priceLabel(property.pricePerNight)} ×{" "}
                      {pluralNights(breakdown.nights)}
                    </span>
                    <span>{priceLabel(breakdown.subtotal)}</span>
                  </div>
                  <div className="flex justify-between border-t border-slate-100 pt-2 text-base font-extrabold text-ink">
                    <span>Итого</span>
                    <span>{priceLabel(breakdown.total)}</span>
                  </div>
                </>
              ) : (
                <p className="text-xs text-ink-muted">
                  Выберите даты, чтобы рассчитать стоимость.
                </p>
              )}
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
