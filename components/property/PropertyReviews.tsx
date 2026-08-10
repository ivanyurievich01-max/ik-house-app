import { Star } from "lucide-react";
import type { Review } from "@/types/property";
import { cn, formatDateHuman, pluralReviews } from "@/lib/utils";
import { ratingLabel } from "@/lib/constants";

export default function PropertyReviews({
  rating,
  reviewsCount,
  reviews,
}: {
  rating: number;
  reviewsCount: number;
  reviews: Review[];
}) {
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-600 text-lg font-extrabold text-white">
            {rating.toFixed(1)}
          </span>
          <div>
            <div className="font-bold text-ink">{ratingLabel(rating)}</div>
            <div className="text-sm text-ink-muted">
              {pluralReviews(reviewsCount)}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {reviews.map((r) => (
          <figure
            key={r.id}
            className="rounded-2xl border border-slate-200 p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                  {r.name[0]}
                </span>
                <div>
                  <div className="text-sm font-semibold text-ink">
                    {r.name}, {r.city}
                  </div>
                  <div className="text-xs text-ink-muted">
                    {formatDateHuman(r.date)}
                  </div>
                </div>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-3.5 w-3.5",
                      i < r.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-slate-200",
                    )}
                  />
                ))}
              </div>
            </div>
            <blockquote className="mt-3 text-sm text-ink-soft">
              {r.text}
            </blockquote>
          </figure>
        ))}
      </div>
    </div>
  );
}
