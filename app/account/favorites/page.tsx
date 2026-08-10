import Link from "next/link";
import { redirect } from "next/navigation";
import { Heart } from "lucide-react";
import { getSessionUser, getMyFavoriteIds } from "@/lib/db/account";
import { getPublishedProperties } from "@/lib/db/properties";
import PropertyCard from "@/components/catalog/PropertyCard";

export const dynamic = "force-dynamic";

export default async function AccountFavoritesPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/account/favorites");

  const [ids, all] = await Promise.all([
    getMyFavoriteIds(),
    getPublishedProperties(),
  ]);
  const items = all.filter((p) => ids.includes(p.id));

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Избранное</h1>
      <p className="mt-1 text-ink-muted">
        Жильё, которое вы сохранили, — доступно с любого устройства.
      </p>

      {items.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-rose-50">
            <Heart className="h-7 w-7 text-rose-400" />
          </div>
          <h3 className="mt-3 font-bold text-ink">
            В избранном пока пусто
          </h3>
          <p className="mt-1 text-sm text-ink-muted">
            Нажимайте на сердечко в каталоге, чтобы сохранять понравившееся жильё.
          </p>
          <Link href="/catalog" className="btn-primary mt-4">
            Смотреть каталог
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      )}
    </div>
  );
}
