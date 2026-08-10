export type BookingStatus =
  | "pending"
  | "confirmed"
  | "declined"
  | "cancelled"
  | "completed";

export const BOOKING_STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Ожидает подтверждения",
  confirmed: "Подтверждено",
  declined: "Отклонено",
  cancelled: "Отменено",
  completed: "Завершено",
};

export const BOOKING_STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-50 text-amber-700",
  confirmed: "bg-emerald-50 text-emerald-700",
  declined: "bg-rose-50 text-rose-600",
  cancelled: "bg-slate-100 text-ink-muted",
  completed: "bg-slate-100 text-ink-soft",
};
