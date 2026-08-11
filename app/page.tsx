import Hero from "@/components/home/Hero";
import ShoreCards from "@/components/home/ShoreCards";
import HousingTypes, {
  type HousingTypeCard,
} from "@/components/home/HousingTypes";
import PopularSection from "@/components/home/PopularSection";
import SeasonalBanner from "@/components/home/SeasonalBanner";
import TrustSection from "@/components/home/TrustSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import {
  getFeaturedProperties,
  getPublishedProperties,
} from "@/lib/db/properties";
import type { Property, PropertyType } from "@/types/property";

export const revalidate = 60;

function minPriceFor(all: Property[], types: PropertyType[]): number | null {
  const prices = all
    .filter((p) => types.includes(p.type))
    .map((p) => p.pricePerNight);
  return prices.length ? Math.min(...prices) : null;
}

export default async function HomePage() {
  const [featured, all] = await Promise.all([
    getFeaturedProperties(8),
    getPublishedProperties(),
  ]);

  const cards: HousingTypeCard[] = [
    {
      key: "resort",
      href: "/catalog?type=resort",
      title: "Пансионаты",
      desc: "Всё включено: территория, бассейн, питание и сервис",
      minPrice: minPriceFor(all, ["resort"]),
      cta: "Смотреть пансионаты",
      img: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=70",
      alt: "Пансионат с бассейном на Иссык-Куле",
      icon: "resort",
      badge: "Популярно",
    },
    {
      key: "houses",
      href: "/catalog?type=guesthouse&type=cottage",
      title: "Гостевые дома и коттеджи",
      desc: "Уютное жильё для семьи и компании",
      minPrice: minPriceFor(all, ["guesthouse", "cottage", "house"]),
      cta: "Смотреть дома",
      img: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1200&q=70",
      alt: "Деревянный коттедж у воды",
      icon: "house",
    },
    {
      key: "villas",
      href: "/catalog?type=villa&type=apartment",
      title: "Виллы и апартаменты",
      desc: "Современное жильё с комфортом городского уровня",
      minPrice: minPriceFor(all, ["villa", "apartment"]),
      cta: "Смотреть виллы",
      img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=70",
      alt: "Современная вилла с бассейном",
      icon: "villa",
    },
  ];

  const ratings = all.map((p) => p.rating).filter((r) => r > 0);
  const stats = {
    objects: all.length,
    locations: new Set(all.map((p) => p.location)).size,
    avgRating: ratings.length
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : null,
  };

  return (
    <>
      <Hero />
      <ShoreCards />
      <HousingTypes cards={cards} />
      <TrustSection />
      <PopularSection items={featured} />
      <SeasonalBanner stats={stats} />
      <ReviewsSection />
    </>
  );
}
