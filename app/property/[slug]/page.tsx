import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Users,
  BedDouble,
  Bath,
  Star,
  ChevronRight,
} from "lucide-react";
import {
  getPropertyBySlug,
  getSimilarProperties,
} from "@/lib/db/properties";
import { SHORE_LABELS, TYPE_LABELS, ratingLabel } from "@/lib/constants";
import { priceLabel, pluralReviews, seededInt } from "@/lib/utils";
import Gallery from "@/components/property/Gallery";
import BookingCard from "@/components/property/BookingCard";
import AvailabilityCalendar from "@/components/property/AvailabilityCalendar";
import OwnerCard from "@/components/property/OwnerCard";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import MapBlock from "@/components/property/MapBlock";
import PropertyReviews from "@/components/property/PropertyReviews";
import SimilarProperties from "@/components/property/SimilarProperties";
import MobileStickyCta from "@/components/property/MobileStickyCta";
import ShareButton from "@/components/property/ShareButton";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getPropertyBySlug(params.slug);
  if (!p) return { title: "Объект не найден" };
  return {
    title: `${p.title} — ${p.location}`,
    description: `${p.title} на Иссык-Куле (${p.location}, ${SHORE_LABELS[p.shore]}). ${p.description.slice(0, 120)}`,
    openGraph: {
      title: `${p.title} — ${p.location} | IK-HOUSE`,
      description: p.description.slice(0, 160),
      images: [{ url: p.images[0] }],
      type: "website",
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) notFound();

  const similar = await getSimilarProperties(params.slug, 4);
  const viewers = seededInt(property.id + "v", 6, 19);
  const spotsLeft = seededInt(property.id + "s", 1, 5);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: property.title,
    description: property.description,
    image: property.images,
    address: {
      "@type": "PostalAddress",
      addressLocality: property.location,
      addressRegion: "Иссык-Куль",
      addressCountry: "KG",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: property.coordinates.lat,
      longitude: property.coordinates.lng,
    },
    priceRange: `${priceLabel(property.pricePerNight)} / ночь`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: property.rating,
      reviewCount: property.reviewsCount,
      bestRating: 5,
    },
  };

  return (
    <div className="pb-24 lg:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container-page pt-5">
        {/* Breadcrumb */}
        <nav className="flex flex-wrap items-center gap-1 text-sm text-ink-muted">
          <Link href="/" className="hover:text-brand-600">
            Главная
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <Link href="/catalog" className="hover:text-brand-600">
            Жильё
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-ink-soft">{property.title}</span>
        </nav>

        <div className="mt-4">
          <Gallery
            images={property.images}
            title={property.title}
            propertyId={property.id}
          />
        </div>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Основной контент */}
          <div className="lg:col-span-2">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="chip mb-2 bg-brand-50 text-brand-700">
                  {TYPE_LABELS[property.type]}
                </span>
                <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
                  {property.title}
                </h1>
              </div>
              <div className="shrink-0 pt-1">
                <ShareButton
                  title={`${property.title} — IK-HOUSE`}
                  text={`${property.title}, ${property.location}. Жильё на Иссык-Куле.`}
                />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-brand-500" />
                {property.location}, {SHORE_LABELS[property.shore]} ·{" "}
                {property.distanceToBeach} м до берега
              </span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <Users className="h-4 w-4 text-ink-muted" /> до {property.guests}{" "}
                гостей
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BedDouble className="h-4 w-4 text-ink-muted" />{" "}
                {property.bedrooms} спальни · {property.beds} кровати
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-ink-muted" /> {property.bathrooms}{" "}
                санузла
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                {property.rating.toFixed(1)} · {ratingLabel(property.rating)} ·{" "}
                {pluralReviews(property.reviewsCount)}
              </span>
            </div>

            <hr className="my-6 border-slate-100" />

            <h2 className="mb-2 text-lg font-bold text-ink">Об объекте</h2>
            <p className="whitespace-pre-line text-ink-soft">
              {property.description}
            </p>

            <hr className="my-6 border-slate-100" />

            <h2 className="mb-4 text-lg font-bold text-ink">Удобства</h2>
            <AmenitiesGrid amenities={property.amenities} />

            <hr className="my-6 border-slate-100" />

            <h2 className="mb-4 text-lg font-bold text-ink">Расположение</h2>
            <MapBlock
              lat={property.coordinates.lat}
              lng={property.coordinates.lng}
              label={`${property.location}, Иссык-Куль`}
            />

            <hr className="my-6 border-slate-100" />

            <h2 className="mb-4 text-lg font-bold text-ink">Отзывы гостей</h2>
            <PropertyReviews
              rating={property.rating}
              reviewsCount={property.reviewsCount}
              reviews={property.reviews ?? []}
            />
          </div>

          {/* Сайдбар */}
          <aside className="lg:col-span-1">
            <div className="space-y-4 lg:sticky lg:top-20">
              <BookingCard
                property={property}
                viewers={viewers}
                spotsLeft={spotsLeft}
              />
              <AvailabilityCalendar
                blockedDates={property.blockedDates ?? []}
              />
              <MapBlock
                compact
                lat={property.coordinates.lat}
                lng={property.coordinates.lng}
                label={`${property.location}, Иссык-Куль`}
              />
              <OwnerCard owner={property.owner} propertyTitle={property.title} />
            </div>
          </aside>
        </div>
      </div>

      <SimilarProperties items={similar} />

      <MobileStickyCta price={property.pricePerNight} slug={property.slug} />
    </div>
  );
}
