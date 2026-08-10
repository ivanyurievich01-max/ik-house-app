import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarCheck } from "lucide-react";
import {
  getSessionUser,
  getMyBookings,
  coverImage,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/lib/db/account";
import SafeImage from "@/components/ui/SafeImage";
import {
  formatDateHuman,
  formatSom,
  pluralGuests,
  pluralNights,
} from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/account/bookings");

  const bookings = await getMyBookings();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Мои заявки</h1>
      <p className="mt-1 text-ink-muted">
        Все ваши заявки на бронирование и их статусы.
      </p>

      {bookings.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <CalendarCheck className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">У вас пока нет заявок</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Найдите подходящее жильё на Иссык-Куле и отправьте заявку.
          </p>
          <Link href="/catalog" className="btn-primary mt-4">
            Найти жильё
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => {
            const img = coverImage(b);
            return (
              <div key={b.id} className="card p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-40">
                    {img && (
                      <SafeImage
                        src={img}
                        alt={b.property?.title ?? ""}
                        fill
                        sizes="(max-width: 640px) 100vw, 160px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        {b.property ? (
                          <Link
                            href={`/property/${b.property.slug}`}
                            className="font-bold text-ink hover:text-brand-600"
                          >
                            {b.property.title}
                          </Link>
                        ) : (
                          <span className="font-bold text-ink">Объект</span>
                        )}
                        {b.property?.location && (
                          <div className="text-sm text-ink-muted">
                            {b.property.location}, Иссык-Куль
                          </div>
                        )}
                      </div>
                      <span className={`chip ${BOOKING_STATUS_STYLES[b.status]}`}>
                        {BOOKING_STATUS_LABELS[b.status]}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-soft sm:grid-cols-3">
                      <div>
                        <span className="text-ink-muted">Заезд: </span>
                        {formatDateHuman(b.check_in)}
                      </div>
                      <div>
                        <span className="text-ink-muted">Выезд: </span>
                        {formatDateHuman(b.check_out)}
                      </div>
                      <div>{pluralGuests(b.guests)}</div>
                      <div>{pluralNights(b.nights)}</div>
                      <div className="font-semibold text-ink">
                        {formatSom(b.total_price)} сом
                      </div>
                      <div className="text-ink-muted">№ {b.booking_number}</div>
                    </div>

                    {b.status === "declined" && (
                      <p className="mt-2 text-sm text-ink-muted">
                        К сожалению, владелец отклонил заявку. Посмотрите{" "}
                        <Link
                          href="/catalog"
                          className="text-brand-600 hover:underline"
                        >
                          другие варианты
                        </Link>
                        .
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
