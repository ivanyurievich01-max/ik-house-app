import Hero from "@/components/home/Hero";
import ShoreCards from "@/components/home/ShoreCards";
import PopularSection from "@/components/home/PopularSection";
import UrgencyBanner from "@/components/home/UrgencyBanner";
import TrustSection from "@/components/home/TrustSection";
import ReviewsSection from "@/components/home/ReviewsSection";
import { getFeaturedProperties } from "@/lib/db/properties";

export const revalidate = 60;

export default async function HomePage() {
  const featured = await getFeaturedProperties(8);
  return (
    <>
      <Hero />
      <ShoreCards />
      <PopularSection items={featured} />
      <UrgencyBanner />
      <TrustSection />
      <ReviewsSection />
    </>
  );
}
