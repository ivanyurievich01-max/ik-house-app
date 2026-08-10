import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type Profile = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  avatar_url: string | null;
  role: "guest" | "owner" | "admin";
  status: "active" | "suspended" | "blocked";
  phone_verified: boolean;
};

export type BookingRow = {
  id: string;
  booking_number: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  total_price: number;
  status: "pending" | "confirmed" | "declined" | "cancelled" | "completed";
  comment: string | null;
  created_at: string;
  property: {
    slug: string;
    title: string;
    location: string;
    property_images: { url: string; is_cover: boolean; sort_order: number }[];
  } | null;
};

export {
  BOOKING_STATUS_LABELS,
  BOOKING_STATUS_STYLES,
} from "@/lib/booking-status";

export async function getSessionUser(): Promise<{
  user: User;
  profile: Profile | null;
} | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase
    .from("profiles")
    .select(
      "id, first_name, last_name, phone, avatar_url, role, status, phone_verified",
    )
    .eq("id", user.id)
    .maybeSingle();
  return { user, profile: (profile as Profile) ?? null };
}

export async function getMyBookings(): Promise<BookingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id, booking_number, check_in, check_out, guests, nights, total_price,
      status, comment, created_at,
      property:properties ( slug, title, location, property_images ( url, is_cover, sort_order ) )
    `,
    )
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[IK-HOUSE] Ошибка загрузки заявок:", error);
    return [];
  }
  return (data as unknown as BookingRow[]) ?? [];
}

export async function getMyFavoriteIds(): Promise<string[]> {
  const supabase = createClient();
  const { data } = await supabase.from("favorites").select("property_id");
  return (data ?? []).map((f) => f.property_id as string);
}

export function coverImage(b: BookingRow): string | null {
  const imgs = b.property?.property_images ?? [];
  if (!imgs.length) return null;
  const sorted = [...imgs].sort(
    (a, z) => Number(z.is_cover) - Number(a.is_cover) || a.sort_order - z.sort_order,
  );
  return sorted[0].url;
}
