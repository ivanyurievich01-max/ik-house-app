import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Property } from "@/types/property";
import PropertyCard from "@/components/catalog/PropertyCard";

export default function PopularSection({ items }: { items: Property[] }) {
  return (
    <section className="container-page py-6">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-ink sm:text-3xl">
            Популярное жильё на Иссык-Куле
          </h2>
          <p className="mt-1 text-ink-muted">
            Объекты, которые чаще всего бронируют гости.
          </p>
        </div>
        <Link
          href="/catalog"
          className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-brand-600 hover:gap-2.5 sm:inline-flex"
        >
          Все варианты <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>

      <div className="mt-6 sm:hidden">
        <Link href="/catalog" className="btn-outline w-full">
          Все варианты <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
