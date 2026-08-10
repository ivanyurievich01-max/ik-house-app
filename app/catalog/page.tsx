import { Suspense } from "react";
import type { Metadata } from "next";
import { getPublishedProperties } from "@/lib/db/properties";
import CatalogClient from "@/components/catalog/CatalogClient";

export const metadata: Metadata = {
  title: "Каталог жилья на Иссык-Куле",
  description:
    "Коттеджи, гостевые дома, пансионаты и виллы на Иссык-Куле. Фильтры по берегу, цене, гостям и удобствам.",
};

export const revalidate = 60;

function CatalogSkeleton() {
  return (
    <div className="container-page py-10">
      <div className="skeleton h-8 w-64" />
      <div className="mt-6 flex gap-6">
        <div className="hidden w-72 shrink-0 lg:block">
          <div className="skeleton h-[520px] w-full rounded-2xl" />
        </div>
        <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-72 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CatalogPage() {
  const properties = await getPublishedProperties();
  return (
    <Suspense fallback={<CatalogSkeleton />}>
      <CatalogClient properties={properties} />
    </Suspense>
  );
}
