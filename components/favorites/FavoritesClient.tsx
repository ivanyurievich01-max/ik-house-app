"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/catalog/PropertyCard";

export default function FavoritesClient({
  properties,
}: {
  properties: Property[];
}) {
  const { ids, ready } = useFavorites();

  const items = properties.filter((p) => ids.includes(p.id));

  return (
    <div className="container-page py-10">
      <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">Избранное</h1>
      <p className="mt-1 text-ink-muted">
        Сохранённые варианты жилья. Войдите в аккаунт, чтобы список был
        доступен с любого устройства.
      </p>

      {!ready ? (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="skeleton h-72 w-full rounded-2xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50">
            <Heart className="h-7 w-7 text-rose-400" />
          </div>
          <p className="mt-4 text-lg font-bold text-ink">
            Здесь пока пусто
          </p>
          <p className="mt-1 text-ink-muted">
            Нажимайте на сердечко на карточках, чтобы сохранить понравившееся
            жильё.
          </p>
          <Link href="/catalog" className="btn-primary mt-5">
            Подобрать жильё
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
