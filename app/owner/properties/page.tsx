import Link from "next/link";
import { Home, PlusCircle, Pencil, CalendarDays, Eye } from "lucide-react";
import {
  requireOwner,
  getOwnerProperties,
  ownerCover,
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_STYLES,
} from "@/lib/db/owner";
import SafeImage from "@/components/ui/SafeImage";
import { TYPE_LABELS, SHORE_LABELS } from "@/lib/constants";
import { formatSom } from "@/lib/utils";
import type { PropertyType, Shore } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function OwnerPropertiesPage() {
  const owner = await requireOwner();
  const properties = await getOwnerProperties(owner.id);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-ink">Мои объекты</h1>
          <p className="mt-1 text-ink-muted">
            Черновики, объекты на модерации и опубликованные.
          </p>
        </div>
        <Link href="/owner/properties/new" className="btn-primary">
          <PlusCircle className="h-4 w-4" /> Добавить
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <Home className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">У вас пока нет объектов</h3>
          <p className="mt-1 text-sm text-ink-muted">
            Добавьте первое жильё и отправьте его на модерацию.
          </p>
          <Link href="/owner/properties/new" className="btn-primary mt-4">
            Добавить объект
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {properties.map((p) => {
            const cover = ownerCover(p);
            return (
              <div key={p.id} className="card p-4 sm:p-5">
                <div className="flex flex-col gap-4 sm:flex-row">
                  <div className="relative h-44 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-32 sm:w-48">
                    {cover ? (
                      <SafeImage
                        src={cover}
                        alt={p.title}
                        fill
                        sizes="(max-width: 640px) 100vw, 192px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full place-items-center text-ink-muted">
                        <Home className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="truncate font-bold text-ink">
                          {p.title || "Без названия"}
                        </div>
                        <div className="mt-0.5 text-sm text-ink-muted">
                          {TYPE_LABELS[p.type as PropertyType] ?? p.type} ·{" "}
                          {p.location}
                          {p.shore
                            ? `, ${SHORE_LABELS[p.shore as Shore] ?? ""}`
                            : ""}
                        </div>
                      </div>
                      <span
                        className={`chip shrink-0 ${PROPERTY_STATUS_STYLES[p.status]}`}
                      >
                        {PROPERTY_STATUS_LABELS[p.status]}
                      </span>
                    </div>

                    <div className="mt-1.5 text-sm font-semibold text-ink">
                      {formatSom(p.price_per_night)} сом{" "}
                      <span className="font-normal text-ink-muted">/ ночь</span>
                    </div>

                    {p.status === "rejected" && p.rejection_reason && (
                      <div className="mt-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
                        Комментарий модератора: {p.rejection_reason}
                      </div>
                    )}

                    <div className="mt-3 flex flex-wrap gap-2">
                      <Link
                        href={`/owner/properties/${p.id}/edit`}
                        className="btn-outline min-h-11 px-3 py-2 text-sm"
                      >
                        <Pencil className="h-4 w-4" /> Редактировать
                      </Link>
                      <Link
                        href={`/owner/properties/${p.id}/calendar`}
                        className="btn-outline min-h-11 px-3 py-2 text-sm"
                      >
                        <CalendarDays className="h-4 w-4" /> Календарь
                      </Link>
                      {p.status === "published" && (
                        <Link
                          href={`/property/${p.slug}`}
                          className="btn-outline min-h-11 px-3 py-2 text-sm"
                        >
                          <Eye className="h-4 w-4" /> Открыть на сайте
                        </Link>
                      )}
                    </div>
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
