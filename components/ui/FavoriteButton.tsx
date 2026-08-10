"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { cn } from "@/lib/utils";

export default function FavoriteButton({
  id,
  className,
  size = "md",
}: {
  id: string;
  className?: string;
  size?: "sm" | "md";
}) {
  const { isFavorite, toggle } = useFavorites();
  const active = isFavorite(id);
  return (
    <button
      type="button"
      aria-label={active ? "Убрать из избранного" : "Добавить в избранное"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(id);
      }}
      className={cn(
        "grid place-items-center rounded-full bg-white/90 text-ink shadow-soft backdrop-blur transition hover:bg-white active:scale-90",
        size === "md" ? "h-9 w-9" : "h-8 w-8",
        className,
      )}
    >
      <Heart
        className={cn(
          "transition",
          size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4",
          active ? "fill-rose-500 text-rose-500" : "text-ink-soft",
        )}
      />
    </button>
  );
}
