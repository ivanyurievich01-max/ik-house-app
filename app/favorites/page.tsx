import type { Metadata } from "next";
import FavoritesClient from "@/components/favorites/FavoritesClient";
import { getPublishedProperties } from "@/lib/db/properties";

export const metadata: Metadata = {
  title: "Избранное",
  description: "Сохранённое жильё на Иссык-Куле.",
  robots: { index: false },
};

export const revalidate = 60;

export default async function FavoritesPage() {
  const properties = await getPublishedProperties();
  return <FavoritesClient properties={properties} />;
}
