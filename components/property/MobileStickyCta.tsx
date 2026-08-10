"use client";

import { priceLabel } from "@/lib/utils";

export default function MobileStickyCta({
  price,
  slug,
}: {
  price: number;
  slug: string;
}) {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 p-3 shadow-[0_-4px_20px_-8px_rgba(15,23,42,0.2)] backdrop-blur lg:hidden"
      style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
    >
      <div className="container-page flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-wide text-ink-muted">
            от
          </div>
          <div className="text-lg font-extrabold leading-none text-ink">
            {priceLabel(price)}
            <span className="text-xs font-medium text-ink-muted"> / ночь</span>
          </div>
        </div>
        <a href={`/booking/${slug}`} className="btn-cta flex-1 justify-center">
          Забронировать
        </a>
      </div>
    </div>
  );
}
