import Link from "next/link";
import { CalendarCheck, Heart, ArrowRight, Home, KeyRound } from "lucide-react";
import { redirect } from "next/navigation";
import { getMyOwnerProfile } from "@/lib/db/owner";
import {
  getSessionUser,
  getMyBookings,
  getMyFavoriteIds,
  coverImage,
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/lib/db/account";
import SafeImage from "@/components/ui/SafeImage";
import { formatDateHuman, formatSom, pluralGuests } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AccountOverviewPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/account");

  const [bookings, favoriteIds, ownerProfile] = await Promise.all([
    getMyBookings(),
    getMyFavoriteIds(),
    getMyOwnerProfile(),
  ]);

  const active = bookings.filter(
    (b) => b.status === "pending" || b.status === "confirmed",
  );
  const firstName =
    session.profile?.first_name ||
    (session.user.user_metadata?.first_name as string) ||
    "гость";

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">
        Здравствуйте, {firstName}!
      </h1>
      <p className="mt-1 text-ink-muted">
        Здесь собраны ваши заявки и избранное жильё.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/account/bookings"
          className="card flex items-center gap-4 p-5 transition hover:shadow-md"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-brand-50">
            <CalendarCheck className="h-6 w-6 text-brand-600" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">
              {active.length}
            </div>
            <div className="text-sm text-ink-muted">Активные заявки</div>
          </div>
        </Link>
        <Link
          href="/account/favorites"
          className="card flex items-center gap-4 p-5 transition hover:shadow-md"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-rose-50">
            <Heart className="h-6 w-6 text-rose-500" />
          </div>
          <div>
            <div className="text-2xl font-extrabold text-ink">
              {favoriteIds.length}
            </div>
            <div className="text-sm text-ink-muted">В избранном</div>
          </div>
        </Link>
      </div>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-ink">Последние заявки</h2>
          {bookings.length > 0 && (
            <Link
              href="/account/bookings"
              className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 hover:gap-2"
            >
              Все заявки <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {bookings.length === 0 ? (
          <div className="card p-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
              <Home className="h-7 w-7 text-ink-muted" />
            </div>
            <h3 className="mt-3 font-bold text-ink">У вас пока нет заявок</h3>
            <p className="mt-1 text-sm text-ink-muted">
              Найдите подходящее жильё на Иссык-Куле.
            </p>
            <Link href="/catalog" className="btn-primary mt-4">
              Найти жильё
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookings.slice(0, 3).map((b) => {
              const img = coverImage(b);
              return (
                <div key={b.id} className="card flex items-center gap-4 p-4">
                  <div className="relative h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    {img && (
                      <SafeImage
                        src={img}
                        alt={b.property?.title ?? ""}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-bold text-ink">
                      {b.property?.title ?? "Объект"}
                    </div>
                    <div className="mt-0.5 text-sm text-ink-muted">
                      {formatDateHuman(b.check_in)} —{" "}
                      {formatDateHuman(b.check_out)} ·{" "}
                      {pluralGuests(b.guests)} ·{" "}
                      {formatSom(b.total_price)} сом
                    </div>
                  </div>
                  <span
                    className={`chip shrink-0 ${BOOKING_STATUS_STYLES[b.status]}`}
                  >
                    {BOOKING_STATUS_LABELS[b.status]}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* CTA владельца */}
      <div className="mt-8 rounded-2xl bg-gradient-to-r from-brand-600 to-brand-500 p-6 text-white">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <div className="flex items-center gap-2 font-bold">
              <KeyRound className="h-5 w-5" />
              {ownerProfile
                ? "Панель владельца"
                : "Сдаёте жильё на Иссык-Куле?"}
            </div>
            <p className="mt-1 text-sm text-white/85">
              {ownerProfile
                ? "Управляйте объектами, календарём и заявками гостей."
                : "Добавьте свой объект в IK-HOUSE и получайте заявки от гостей."}
            </p>
          </div>
          <Link
            href={ownerProfile ? "/owner" : "/owner/onboarding"}
            className="shrink-0 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50"
          >
            {ownerProfile ? "Открыть панель" : "Стать владельцем"}
          </Link>
        </div>
      </div>
    </div>
  );
}
