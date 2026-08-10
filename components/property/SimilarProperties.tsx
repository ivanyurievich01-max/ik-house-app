import type { Property } from "@/types/property";
import PropertyCard from "@/components/catalog/PropertyCard";

export default function SimilarProperties({ items }: { items: Property[] }) {
  if (items.length === 0) return null;
  return (
    <section className="container-page py-12">
      <h2 className="mb-5 text-2xl font-extrabold text-ink">Похожие варианты</h2>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </section>
  );
}
