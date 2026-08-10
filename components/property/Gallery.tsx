"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, X, Images } from "lucide-react";
import SafeImage from "@/components/ui/SafeImage";
import FavoriteButton from "@/components/ui/FavoriteButton";
import { cn } from "@/lib/utils";

export default function Gallery({
  images,
  title,
  propertyId,
}: {
  images: string[];
  title: string;
  propertyId: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [touchX, setTouchX] = useState<number | null>(null);

  const total = images.length;
  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + total) % total),
    [total],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  const thumbs = images.slice(1, 5);

  return (
    <>
      <div className="grid gap-2 sm:grid-cols-4 sm:grid-rows-2">
        {/* Основное фото */}
        <button
          onClick={() => openAt(0)}
          className="group relative col-span-4 row-span-2 aspect-[16/10] overflow-hidden rounded-2xl sm:col-span-2"
        >
          <SafeImage
            src={images[0]}
            alt={title}
            fill
            priority
            sizes="(max-width: 640px) 100vw, 50vw"
            className="object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <FavoriteButton
            id={propertyId}
            className="absolute right-3 top-3 z-10"
          />
        </button>

        {/* 4 миниатюры */}
        {thumbs.map((img, i) => (
          <button
            key={i}
            onClick={() => openAt(i + 1)}
            className="group relative hidden aspect-square overflow-hidden rounded-xl sm:block"
          >
            <SafeImage
              src={img}
              alt={`${title} — фото ${i + 2}`}
              fill
              sizes="25vw"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            {i === thumbs.length - 1 && total > 5 && (
              <span className="absolute inset-0 flex items-center justify-center gap-1.5 bg-ink/55 text-sm font-semibold text-white">
                <Images className="h-4 w-4" /> +{total - 5} фото
              </span>
            )}
          </button>
        ))}

        {/* Мобильная кнопка "все фото" */}
        <button
          onClick={() => openAt(0)}
          className="btn-outline col-span-4 sm:hidden"
        >
          <Images className="h-4 w-4" /> Все фото ({total})
        </button>
      </div>

      {/* Fullscreen modal */}
      {open && (
        <div className="fixed inset-0 z-[60] flex flex-col bg-ink/95">
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm">
              {index + 1} / {total}
            </span>
            <button
              onClick={() => setOpen(false)}
              aria-label="Закрыть галерею"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-white/10"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div
            className="relative flex flex-1 items-center justify-center px-2 sm:px-6"
            onTouchStart={(e) => setTouchX(e.touches[0].clientX)}
            onTouchEnd={(e) => {
              if (touchX === null) return;
              const dx = e.changedTouches[0].clientX - touchX;
              if (Math.abs(dx) > 48) go(dx < 0 ? 1 : -1);
              setTouchX(null);
            }}
          >
            <button
              onClick={() => go(-1)}
              aria-label="Предыдущее фото"
              className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            <div className="relative h-full max-h-[75vh] w-full max-w-4xl">
              <SafeImage
                src={images[index]}
                alt={`${title} — фото ${index + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
            </div>

            <button
              onClick={() => go(1)}
              aria-label="Следующее фото"
              className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 sm:right-6"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

          {/* Лента миниатюр */}
          <div className="no-scrollbar flex gap-2 overflow-x-auto p-4">
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={cn(
                  "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                  i === index ? "ring-white" : "ring-transparent opacity-60",
                )}
              >
                <SafeImage
                  src={img}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
