import Link from "next/link";
import {
  Users,
  KeyRound,
  Home,
  CheckCircle2,
  Clock,
  CalendarCheck,
} from "lucide-react";
import { requireAdmin, getAdminStats } from "@/lib/db/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  await requireAdmin();
  const s = await getAdminStats();

  const cards = [
    { label: "Пользователей", value: s.users, icon: Users, href: "/admin/users", color: "bg-brand-50 text-brand-600" },
    { label: "Владельцев", value: s.owners, icon: KeyRound, href: "/admin/owners", color: "bg-violet-50 text-violet-600" },
    { label: "Владельцы на проверке", value: s.owners_pending, icon: Clock, href: "/admin/owners", color: "bg-amber-50 text-amber-600" },
    { label: "Всего объектов", value: s.properties, icon: Home, href: "/admin/properties?status=all", color: "bg-brand-50 text-brand-600" },
    { label: "Опубликовано", value: s.published, icon: CheckCircle2, href: "/admin/properties?status=published", color: "bg-emerald-50 text-emerald-600" },
    { label: "На модерации", value: s.pending_review, icon: Clock, href: "/admin/properties?status=pending_review", color: "bg-amber-50 text-amber-600" },
    { label: "Всего заявок", value: s.bookings, icon: CalendarCheck, href: "/admin/bookings", color: "bg-brand-50 text-brand-600" },
    { label: "Новые заявки", value: s.bookings_pending, icon: Clock, href: "/admin/bookings?status=pending", color: "bg-rose-50 text-rose-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Обзор платформы</h1>
      <p className="mt-1 text-ink-muted">
        Ключевые показатели IK-HOUSE и быстрый доступ к модерации.
      </p>

      {s.pending_review > 0 && (
        <Link
          href="/admin/properties?status=pending_review"
          className="mt-5 flex items-center justify-between gap-3 rounded-2xl bg-amber-50 p-4 text-amber-800 transition hover:bg-amber-100"
        >
          <span className="font-semibold">
            ⏳ {s.pending_review} объект(ов) ждут модерации
          </span>
          <span className="text-sm font-bold">Проверить →</span>
        </Link>
      )}

      <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="card flex items-center gap-3 p-4 transition hover:shadow-md"
          >
            <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${c.color}`}>
              <c.icon className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-extrabold text-ink">{c.value}</div>
              <div className="truncate text-xs text-ink-muted sm:text-sm">
                {c.label}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
