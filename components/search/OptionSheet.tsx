"use client";

import { Check, X } from "lucide-react";

/* Мобильный bottom sheet выбора одного варианта (локация, тип жилья). */
export default function OptionSheet({
  open,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  open: boolean;
  title: string;
  options: { value: string; label: string }[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[60] bg-ink/40" onClick={onClose} />
      <div className="fixed inset-x-0 bottom-0 z-[70] max-h-[75vh] overflow-y-auto rounded-t-2xl border border-slate-200 bg-white p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-card-hover">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-bold text-ink">{title}</span>
          <button
            type="button"
            aria-label="Закрыть"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-muted hover:bg-slate-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div>
          {options.map((o) => (
            <button
              key={o.value || "any"}
              type="button"
              onClick={() => {
                onSelect(o.value);
                onClose();
              }}
              className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-[15px] text-ink hover:bg-slate-50"
            >
              {o.label}
              {o.value === value && (
                <Check className="h-4 w-4 text-brand-600" />
              )}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
