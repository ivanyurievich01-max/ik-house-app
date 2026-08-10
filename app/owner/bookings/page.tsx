import { CalendarCheck } from "lucide-react";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/db/account";
import { requireOwner, getOwnerBookings } from "@/lib/db/owner";
import OwnerBookingCard from "@/components/owner/OwnerBookingCard";

export const dynamic = "force-dynamic";

export default async function OwnerBookingsPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/owner/bookings");
  const owner = await requireOwner();
  const bookings = await getOwnerBookings(owner.id);

  const pending = bookings.filter((b) => b.status === "pending");
  const rest = bookings.filter((b) => b.status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Заявки гостей</h1>
      <p className="mt-1 text-ink-muted">
        Подтверждайте или отклоняйте заявки — гость увидит статус в своём
        кабинете.
      </p>

      {bookings.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <CalendarCheck className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">Заявок пока нет</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Когда гость отправит заявку на ваш объект, она появится здесь.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-ink">
                Новые заявки ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((b) => (
                  <OwnerBookingCard key={b.id} booking={b} highlight />
                ))}
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-ink">История</h2>
              <div className="space-y-4">
                {rest.map((b) => (
                  <OwnerBookingCard key={b.id} booking={b} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
