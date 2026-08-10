import Link from "next/link";
import {
  Home,
  Clock,
  CalendarCheck,
  CheckCircle2,
  PlusCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import {
  requireOwner,
  getOwnerProperties,
  getOwnerBookings,
} from "@/lib/db/owner";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/lib/db/account";
import { formatDateHuman, formatSom, pluralGuests } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function OwnerDashboardPage() {
  const owner = await requireOwner();
  const [properties, bookings] = await Promise.all([
    getOwnerProperties(owner.id),
    getOwnerBookings(owner.id),
  ]);

  const published = properties.filter((p) => p.status === "published").length;
  const pendingReview = properties.filter(
    (p) => p.status === "pending_review",
  ).length;
  const newBookings = bookings.filter((b) => b.status === "pending").length;
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;

  const stats = [
    {
      label: "Всего объектов",
      value: properties.length,
      icon: Home,
      color: "bg-brand-50 text-brand-600",
      href: "/owner/properties",
    },
    {
      label: "На модерации",
      value: pendingReview,
      icon: Clock,
      color: "bg-amber-50 text-amber-600",
      href: "/owner/properties",
    },
    {
      label: "Новые заявки",
      value: newBookings,
      icon: CalendarCheck,
      color: "bg-rose-50 text-rose-500",
      href: "/owner/bookings",
    },
    {
      label: "Подтверждено",
      value: confirmed,
      icon: CheckCircle2,
      color: "bg-emerald-50 text-emerald-600",
      href: "/owner/bookings",
    },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Панель владельца</h1>
          <p className="mt-1 text-ink-muted">
            {owner.display_name} · опубликовано: {published}
          </p>
        </div>
        <Link href="/owner/properties/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Добавить объект
        </Link>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card flex items-center gap-3 p-4 transition hover:shadow-md sm:p-5"
          >
            <div
              className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${s.color}`}
            >
              <s.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-extrabold text-ink sm:text-2xl">
                {s.value}
              </div>
              <div className="truncate text-xs text-ink-muted sm:text-sm">
                {s.label}
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Последние заявки</h2>
          {bookings.length > 0 && (
            <Link
              href="/owner/bookings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2"
            >
              Все заявки <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
              <CalendarCheck className="h-7 w-7 text-ink-muted" />
            </div>
            <h3 className="mt-3 font-bold text-ink">Заявок пока нет</h3>
            <p className="mt-1 text-sm text-ink-muted">
              {properties.length === 0
                ? "Добавьте первое жильё и отправьте его на модерацию."
                : "Как только гость отправит заявку — она появится здесь."}
            </p>
            {properties.length === 0 && (
              <Link href="/owner/properties/new" className="btn-primary mt-4">
                Добавить объект
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 4).map((b) => (
              <Link
                key={b.id}
                href="/owner/bookings"
                className="card flex items-center gap-3 p-4 transition hover:shadow-md"
              >
                <div className="min-w-0 flex-1">
                  <div className="truncate font-bold text-ink">
                    {b.property?.title ?? "Объект"}
                  </div>
                  <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-muted">
                    <span>{b.guest_first_name}</span>
                    <span className="inline-flex items-center gap-1">
                      <Phone className="h-3.5 w-3.5" /> {b.guest_phone}
                    </span>
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
                <span
                  className={`chip shrink-0 ${BOOKING_STATUS_STYLES[b.status]}`}
                >
                  {BOOKING_STATUS_LABELS[b.status]}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
