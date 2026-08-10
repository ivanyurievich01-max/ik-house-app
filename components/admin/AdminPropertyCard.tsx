"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Home,
  Eye,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdminPropertyRow } from "@/lib/db/admin";
import SafeImage from "@/components/ui/SafeImage";
import { TYPE_LABELS, SHORE_LABELS } from "@/lib/constants";
import { cn, formatSom } from "@/lib/utils";
import type { PropertyType, Shore } from "@/types/property";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_STYLES,
} from "@/lib/property-status";

export default function AdminPropertyCard({
  property,
}: {
  property: AdminPropertyRow;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(property.status);
  const [busy, setBusy] = useState<null | string>(null);
  const [error, setError] = useState("");
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");

  const cover = [...(property.property_images ?? [])].sort(
    (a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
  )[0]?.url;

  async function publish() {
    setBusy("publish");
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: dbErr } = await supabase
      .from("properties")
      .update({
        status: "published",
        published_at: new Date().toISOString(),
        rejection_reason: null,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id ?? null,
      })
      .eq("id", property.id);
    setBusy(null);
    if (dbErr) {
      setError("Не удалось опубликовать");
      return;
    }
    setStatus("published");
    router.refresh();
  }

  async function reject() {
    if (reason.trim().length < 5) {
      setError("Укажите причину для владельца (минимум 5 символов)");
      return;
    }
    setBusy("reject");
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: dbErr } = await supabase
      .from("properties")
      .update({
        status: "rejected",
        rejection_reason: reason.trim(),
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id ?? null,
      })
      .eq("id", property.id);
    setBusy(null);
    if (dbErr) {
      setError("Не удалось отклонить");
      return;
    }
    setStatus("rejected");
    setRejectMode(false);
    router.refresh();
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-40 w-full shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-28 sm:w-44">
          {cover ? (
            <SafeImage
              src={cover}
              alt={property.title}
              fill
              sizes="(max-width: 640px) 100vw, 176px"
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
                {property.title || "Без названия"}
              </div>
              <div className="mt-0.5 text-sm text-ink-muted">
                {TYPE_LABELS[property.type as PropertyType] ?? property.type} ·{" "}
                {property.location},{" "}
                {SHORE_LABELS[property.shore as Shore] ?? property.shore} ·{" "}
                <span className="font-semibold text-ink">
                  {formatSom(property.price_per_night)} сом/ночь
                </span>
              </div>
              <div className="mt-0.5 text-sm text-ink-muted">
                Владелец: {property.owner?.display_name ?? "—"}
                {property.owner?.public_phone
                  ? ` · ${property.owner.public_phone}`
                  : ""}
              </div>
            </div>
            <span
              className={`chip shrink-0 ${PROPERTY_STATUS_STYLES[status] ?? "bg-slate-100"}`}
            >
              {PROPERTY_STATUS_LABELS[status] ?? status}
            </span>
          </div>

          {status === "rejected" && property.rejection_reason && (
            <div className="mt-2 rounded-xl bg-rose-50 p-2.5 text-sm text-rose-600">
              Причина: {property.rejection_reason}
            </div>
          )}

          {error && (
            <div className="mt-2 flex items-start gap-2 rounded-xl bg-rose-50 p-2.5 text-sm text-rose-600">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </div>
          )}

          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href={`/admin/properties/${property.id}/preview`}
              className="btn-outline min-h-11 px-3 py-2 text-sm"
            >
              <Eye className="h-4 w-4" /> Предпросмотр
            </Link>

            {(status === "pending_review" || status === "rejected") && (
              <button
                onClick={publish}
                disabled={busy !== null}
                className="btn-primary min-h-11 px-4 py-2 text-sm"
              >
                {busy === "publish" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Check className="h-4 w-4" />
                )}
                Опубликовать
              </button>
            )}

            {(status === "pending_review" || status === "published") && (
              <button
                onClick={() => setRejectMode((v) => !v)}
                disabled={busy !== null}
                className="btn-outline min-h-11 border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
              >
                <X className="h-4 w-4" />
                {status === "published" ? "Снять с публикации" : "Отклонить"}
              </button>
            )}
          </div>

          {rejectMode && (
            <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <label className="label" htmlFor={`reason-${property.id}`}>
                Комментарий владельцу (обязательно)
              </label>
              <textarea
                id={`reason-${property.id}`}
                className="input min-h-20"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Что нужно исправить: качество фото, описание, цена…"
                maxLength={500}
              />
              <div className="mt-2 flex gap-2">
                <button
                  onClick={reject}
                  disabled={busy !== null}
                  className={cn(
                    "min-h-10 rounded-xl bg-rose-500 px-4 text-sm font-bold text-white hover:bg-rose-600",
                  )}
                >
                  {busy === "reject" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Отправить владельцу"
                  )}
                </button>
                <button
                  onClick={() => setRejectMode(false)}
                  className="btn-outline min-h-10 px-4 py-2 text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
