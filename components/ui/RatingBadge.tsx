import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { ratingLabel } from "@/lib/constants";

export default function RatingBadge({
  rating,
  withLabel = true,
  className,
}: {
  rating: number;
  withLabel?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-1.5 py-0.5 text-xs font-bold text-white shadow-sm">
        <Star className="h-3 w-3 fill-white" />
        {rating.toFixed(1)}
      </span>
      {withLabel && (
        <span className="text-xs font-semibold text-ink-soft">
          {ratingLabel(rating)}
        </span>
      )}
    </div>
  );
}
