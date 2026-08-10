import "server-only";
import { createPublicClient } from "@/lib/supabase/server";
import type { Amenity, Owner, Property, PropertyType, Review, Shore } from "@/types/property";
import { CONTACTS } from "@/lib/constants";
import {
  properties as mockProperties,
  getProperty as getMockProperty,
  getFeatured as getMockFeatured,
  getSimilar as getMockSimilar,
} from "@/data/properties";

/**
 * Источник данных каталога.
 * Если Supabase не настроен (нет env) или запрос упал — используется
 * встроенный demo-набор, чтобы сайт никогда не оказался пустым.
 */
export function dbConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const DEFAULT_OWNER: Owner = {
  name: "IK-HOUSE",
  role: "Служба поддержки",
  phone: CONTACTS.phoneHref,
  whatsapp: CONTACTS.whatsapp,
  avatar: "",
};

export type DbRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string;
  shore: string;
  address: string | null;
  distance_to_beach: number | null;
  rating: number | string;
  reviews_count: number;
  price_per_night: number;
  old_price: number | null;
  max_guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  description: string;
  featured: boolean;
  popular: boolean;
  latitude: number | null;
  longitude: number | null;
  property_images: { url: string; sort_order: number; is_cover: boolean }[];
  property_amenities: { amenity_key: string }[];
  owner: {
    display_name: string;
    verification_status: string;
    public_phone: string | null;
    whatsapp: string | null;
    avatar_url: string | null;
    show_public_contact: boolean;
  } | null;
};

export const PROPERTY_SELECT = `
  id, slug, title, type, location, shore, address, distance_to_beach,
  rating, reviews_count, price_per_night, old_price,
  max_guests, bedrooms, beds, bathrooms, description,
  featured, popular, latitude, longitude,
  property_images ( url, sort_order, is_cover ),
  property_amenities ( amenity_key ),
  owner:owner_profiles ( display_name, verification_status, public_phone, whatsapp, avatar_url, show_public_contact )
`;

export function mapRow(row: DbRow): Property {
  const images = [...(row.property_images ?? [])]
    .sort((a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order)
    .map((i) => i.url);

  const owner: Owner = row.owner
    ? {
        name: row.owner.display_name,
        role:
          row.owner.verification_status === "verified"
            ? "Проверенный владелец"
            : "Владелец",
        phone:
          row.owner.show_public_contact && row.owner.public_phone
            ? row.owner.public_phone
            : CONTACTS.phoneHref,
        whatsapp:
          row.owner.show_public_contact && row.owner.whatsapp
            ? row.owner.whatsapp
            : CONTACTS.whatsapp,
        avatar: row.owner.avatar_url ?? "",
      }
    : DEFAULT_OWNER;

  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    type: row.type as PropertyType,
    location: row.location,
    shore: row.shore as Shore,
    address: row.address ?? "",
    distanceToBeach: row.distance_to_beach ?? 0,
    rating: Number(row.rating) || 0,
    reviewsCount: row.reviews_count ?? 0,
    pricePerNight: row.price_per_night,
    oldPrice: row.old_price ?? undefined,
    guests: row.max_guests,
    bedrooms: row.bedrooms,
    beds: row.beds,
    bathrooms: row.bathrooms,
    description: row.description,
    amenities: (row.property_amenities ?? []).map(
      (a) => a.amenity_key as Amenity,
    ),
    images,
    featured: row.featured,
    popular: row.popular,
    available: true,
    owner,
    coordinates: { lat: row.latitude ?? 42.65, lng: row.longitude ?? 77.08 },
  };
}

export async function getPublishedProperties(): Promise<Property[]> {
  if (!dbConfigured()) return mockProperties;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("status", "published")
      .order("featured", { ascending: false })
      .order("rating", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return mockProperties;
    return (data as unknown as DbRow[]).map(mapRow);
  } catch (e) {
    console.error("[IK-HOUSE] Ошибка загрузки каталога из БД:", e);
    return mockProperties;
  }
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  if (!dbConfigured()) return getMockProperty(slug) ?? null;
  try {
    const supabase = createPublicClient();
    const { data, error } = await supabase
      .from("properties")
      .select(PROPERTY_SELECT)
      .eq("status", "published")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (!data) return getMockProperty(slug) ?? null;

    const property = mapRow(data as unknown as DbRow);

    // Занятые даты (blocked + booked) начиная с сегодняшнего дня
    const today = new Date().toISOString().slice(0, 10);
    const { data: avail } = await supabase
      .from("property_availability")
      .select("date, status")
      .eq("property_id", property.id)
      .in("status", ["blocked", "booked"])
      .gte("date", today);
    property.blockedDates = (avail ?? []).map((a) => a.date as string);

    // Опубликованные отзывы
    const { data: reviews } = await supabase
      .from("reviews")
      .select("id, author_name, author_city, rating, text, created_at")
      .eq("property_id", property.id)
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(12);
    property.reviews = (reviews ?? []).map(
      (r): Review => ({
        id: r.id as string,
        name: (r.author_name as string) ?? "Гость",
        city: (r.author_city as string) ?? "",
        rating: Number(r.rating) || 5,
        date: new Date(r.created_at as string).toLocaleDateString("ru-RU", {
          month: "long",
          year: "numeric",
        }),
        text: r.text as string,
      }),
    );

    return property;
  } catch (e) {
    console.error("[IK-HOUSE] Ошибка загрузки объекта из БД:", e);
    return getMockProperty(slug) ?? null;
  }
}

export async function getFeaturedProperties(limit = 8): Promise<Property[]> {
  if (!dbConfigured()) return getMockFeatured(limit);
  const all = await getPublishedProperties();
  const featured = all.filter((p) => p.featured);
  const rest = all.filter((p) => !p.featured);
  return [...featured, ...rest].slice(0, limit);
}

export async function getSimilarProperties(
  slug: string,
  limit = 4,
): Promise<Property[]> {
  if (!dbConfigured()) return getMockSimilar(slug, limit);
  const all = await getPublishedProperties();
  const current = all.find((p) => p.slug === slug);
  if (!current) return all.slice(0, limit);
  const sameShore = all.filter(
    (p) => p.slug !== slug && p.shore === current.shore,
  );
  const others = all.filter(
    (p) => p.slug !== slug && p.shore !== current.shore,
  );
  return [...sameShore, ...others].slice(0, limit);
}
