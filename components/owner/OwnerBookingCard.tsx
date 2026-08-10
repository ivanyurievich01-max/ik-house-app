"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Phone,
  MessageCircle,
  Check,
  X,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { OwnerBookingRow } from "@/lib/db/owner";
import {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/lib/booking-status";
import {
  cn,
  formatDateHuman,
  formatSom,
  pluralGuests,
  pluralNights,
} from "@/lib/utils";

export default function OwnerBookingCard({
  booking,
  highlight = false,
}: {
  booking: OwnerBookingRow;
  highlight?: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(booking.status);
  const [busy, setBusy] = useState<null | "confirm" | "decline">(null);
  const [error, setError] = useState("");
  const [confirmAction, setConfirmAction] = useState<null | "confirm" | "decline">(null);

  const waDigits = booking.guest_phone.replace(/\D/g, "");

  async function act(action: "confirm" | "decline") {
    setConfirmAction(null);
    setBusy(action);
    setError("");
    const supabase = createClient();
    const { error: rpcErr } = await supabase.rpc(
      action === "confirm" ? "confirm_booking" : "decline_booking",
      { p_booking_id: booking.id },
    );
    setBusy(null);
    if (rpcErr) {
      setError(
        rpcErr.message.includes("DATES_UNAVAILABLE")
          ? "Даты уже заняты другим подтверждённым бронированием"
          : "Не удалось выполнить действие. Попробуйте ещё раз.",
      );
      return;
    }
    setStatus(action === "confirm" ? "confirmed" : "declined");
    router.refresh();
  }

  return (
    <div
      className={cn(
        "card p-4 sm:p-5",
        highlight && status === "pending" && "border-brand-200 ring-1 ring-brand-100",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="truncate font-bold text-ink">
            {booking.property?.title ?? "Объект"}
          </div>
          <div className="mt-0.5 text-sm text-ink-soft">
            {booking.guest_first_name} · {booking.guest_phone}
          </div>
        </div>
        <span className={`chip shrink-0 ${BOOKING_STATUS_STYLES[status]}`}>
          {BOOKING_STATUS_LABELS[status]}
        </span>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-ink-soft sm:grid-cols-4">
        <div>
          <span className="text-ink-muted">Заезд: </span>
          {formatDateHuman(booking.check_in)}
        </div>
        <div>
          <span className="text-ink-muted">Выезд: </span>
          {formatDateHuman(booking.check_out)}
        </div>
        <div>
          {pluralGuests(booking.guests)} · {pluralNights(booking.nights)}
        </div>
        <div className="font-semibold text-ink">
          {formatSom(booking.total_price)} сом
        </div>
      </div>

      {booking.comment && (
        <div className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-ink-soft">
          💬 {booking.comment}
        </div>
      )}

      <div className="mt-1 text-xs text-ink-muted">№ {booking.booking_number}</div>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <a
          href={`tel:${booking.guest_phone.replace(/[^+\d]/g, "")}`}
          className="btn-outline min-h-11 px-3 py-2 text-sm"
        >
          <Phone className="h-4 w-4" /> Позвонить
        </a>
        <a
          href={`https://wa.me/${waDigits}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline min-h-11 px-3 py-2 text-sm"
        >
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>

        {status === "pending" && (
          <>
            <button
              onClick={() => setConfirmAction("decline")}
              disabled={busy !== null}
              className="btn-outline min-h-11 border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
            >
              {busy === "decline" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <X className="h-4 w-4" />
              )}
              Отклонить
            </button>
            <button
              onClick={() => setConfirmAction("confirm")}
              disabled={busy !== null}
              className="btn-primary min-h-11 px-4 py-2 text-sm"
            >
              {busy === "confirm" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Check className="h-4 w-4" />
              )}
              Подтвердить
            </button>
          </>
        )}
      </div>

      {/* Подтверждение действия */}
      {confirmAction && (
        <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <p className="text-sm font-medium text-ink">
            {confirmAction === "confirm"
              ? `Подтвердить бронирование ${formatDateHuman(booking.check_in)} — ${formatDateHuman(booking.check_out)}? Даты будут закрыты для других гостей.`
              : "Отклонить заявку? Гость увидит отказ в своём кабинете."}
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => act(confirmAction)}
              className={cn(
                "min-h-10 rounded-xl px-4 text-sm font-bold text-white",
                confirmAction === "confirm"
                  ? "bg-emerald-600 hover:bg-emerald-700"
                  : "bg-rose-500 hover:bg-rose-600",
              )}
            >
              Да, {confirmAction === "confirm" ? "подтвердить" : "отклонить"}
            </button>
            <button
              onClick={() => setConfirmAction(null)}
              className="btn-outline min-h-10 px-4 py-2 text-sm"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
