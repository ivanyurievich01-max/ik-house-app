import Link from "next/link";
import { Home } from "lucide-react";
import { requireAdmin, getAdminProperties } from "@/lib/db/admin";
import AdminPropertyCard from "@/components/admin/AdminPropertyCard";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const FILTERS = [
  { key: "pending_review", label: "На модерации" },
  { key: "published", label: "Опубликованные" },
  { key: "rejected", label: "Отклонённые" },
  { key: "draft", label: "Черновики" },
  { key: "all", label: "Все" },
];

export default async function AdminPropertiesPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  await requireAdmin();
  const status = searchParams.status ?? "pending_review";
  const properties = await getAdminProperties(status);

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Модерация объектов</h1>
      <p className="mt-1 text-ink-muted">
        Проверяйте объявления владельцев перед публикацией в каталоге.
      </p>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        {FILTERS.map((f) => (
          <Link
            key={f.key}
            href={`/admin/properties?status=${f.key}`}
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

      {properties.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <Home className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">
            {status === "pending_review"
              ? "Нет объектов на модерации"
              : "Ничего не найдено"}
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            {status === "pending_review"
              ? "Когда владелец отправит объявление на проверку, оно появится здесь."
              : "Попробуйте другой фильтр."}
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {properties.map((p) => (
            <AdminPropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
