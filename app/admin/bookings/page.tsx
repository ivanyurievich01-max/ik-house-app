import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { requireAdmin, getAdminBookings } from "@/lib/db/admin";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/lib/booking-status";
import { cn, formatDateHuman, formatSom, pluralGuests } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "all", label: "Все" },
  { key: "pending", label: "Ожидают" },
  { key: "confirmed", label: "Подтверждённые" },
  { key: "declined", label: "Отклонённые" },
];

export default async function AdminBookingsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();
  const status = searchParams.status ?? "all";
  const bookings = await getAdminBookings(status);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Бронирования</h1>
      <p className="mt-1 text-ink-muted">
        Все заявки платформы ({bookings.length}).
      </p>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/bookings?status=${f.key}`}
            className={cn(
              "min-h-10 shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition",
              status === f.key
                ? "border-brand-500 bg-brand-50 text-brand-700"
                : "border-slate-200 text-ink-soft hover:border-slate-300",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {bookings.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <CalendarCheck className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">Заявок не найдено</h3>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {bookings.map((b) => (
            <div key={b.id} className="card p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-ink">
                    {b.property?.title ?? "Объект"}{" "}
                    <span className="font-normal text-ink-muted">
                      · {b.booking_number}
                    </span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-muted">
                    <span>
                      Гость: {b.guest_first_name} · {b.guest_phone}
                    </span>
                    <span>Владелец: {b.owner?.display_name ?? "—"}</span>
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-soft">
                    <span>
                      {formatDateHuman(b.check_in)} —{" "}
                      {formatDateHuman(b.check_out)}
                    </span>
                    <span>{pluralGuests(b.guests)}</span>
                    <span className="font-semibold text-ink">
                      {formatSom(b.total_price)} сом
                    </span>
                  </div>
                </div>
                <span className={`chip shrink-0 ${BOOKING_STATUS_STYLES[b.status]}`}>
                  {BOOKING_STATUS_LABELS[b.status]}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
