export const PROPERTY_STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  pending_review: "На модерации",
  published: "Опубликован",
  rejected: "Нужны изменения",
  archived: "Архив",
  suspended: "Приостановлен",
};

export const PROPERTY_STATUS_STYLES: Record<string, string> = {
  draft: "bg-slate-100 text-ink-soft",
  pending_review: "bg-amber-50 text-amber-700",
  published: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-600",
  archived: "bg-slate-100 text-ink-muted",
  suspended: "bg-rose-50 text-rose-600",
};
