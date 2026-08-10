import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OwnerProfile = {
  id: string;
  user_id: string;
  owner_type: "individual" | "entrepreneur" | "company";
  display_name: string;
  whatsapp: string | null;
  about: string | null;
  avatar_url: string | null;
  public_phone: string | null;
  show_public_contact: boolean;
  verification_status: "unverified" | "pending" | "verified" | "rejected";
};

export type OwnerPropertyRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string;
  shore: string;
  price_per_night: number;
  max_guests: number;
  status:
    | "draft"
    | "pending_review"
    | "published"
    | "rejected"
    | "archived"
    | "suspended";
  rejection_reason: string | null;
  created_at: string;
  published_at: string | null;
  property_images: { url: string; is_cover: boolean; sort_order: number }[];
};

export type OwnerBookingRow = {
  id: string;
  booking_number: string;
  guest_first_name: string;
  guest_phone: string;
  guest_email: string | null;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  total_price: number;
  status: "pending" | "confirmed" | "declined" | "cancelled" | "completed";
  comment: string | null;
  created_at: string;
  property: { id: string; title: string; slug: string } | null;
};

export const PROPERTY_STATUS_LABELS: Record<OwnerPropertyRow["status"], string> = {
  draft: "Черновик",
  pending_review: "На модерации",
  published: "Опубликован",
  rejected: "Нужны изменения",
  archived: "Архив",
  suspended: "Приостановлен",
};

export const PROPERTY_STATUS_STYLES: Record<OwnerPropertyRow["status"], string> = {
  draft: "bg-slate-100 text-ink-soft",
  pending_review: "bg-amber-50 text-amber-700",
  published: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-600",
  archived: "bg-slate-100 text-ink-muted",
  suspended: "bg-rose-50 text-rose-600",
};

/** Owner-профиль текущего пользователя (null, если ещё не владелец) */
export async function getMyOwnerProfile(): Promise<OwnerProfile | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("owner_profiles")
    .select(
      "id, user_id, owner_type, display_name, whatsapp, about, avatar_url, public_phone, show_public_contact, verification_status",
    )
    .eq("user_id", user.id)
    .maybeSingle();
  return (data as OwnerProfile) ?? null;
}

/** Требует owner-профиль; иначе переадресация на онбординг */
export async function requireOwner(): Promise<OwnerProfile> {
  const owner = await getMyOwnerProfile();
  if (!owner) redirect("/owner/onboarding");
  return owner;
}

export async function getOwnerProperties(
  ownerId: string,
): Promise<OwnerPropertyRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("properties")
    .select(
      `
      id, slug, title, type, location, shore, price_per_night, max_guests,
      status, rejection_reason, created_at, published_at,
      property_images ( url, is_cover, sort_order )
    `,
    )
    .eq("owner_id", ownerId)
    .neq("status", "archived")
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[IK-HOUSE] owner properties:", error);
    return [];
  }
  return (data as unknown as OwnerPropertyRow[]) ?? [];
}

export async function getOwnerBookings(
  ownerId: string,
): Promise<OwnerBookingRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("bookings")
    .select(
      `
      id, booking_number, guest_first_name, guest_phone, guest_email,
      check_in, check_out, guests, nights, total_price, status, comment, created_at,
      property:properties ( id, title, slug )
    `,
    )
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false });
  if (error) {
    console.error("[IK-HOUSE] owner bookings:", error);
    return [];
  }
  return (data as unknown as OwnerBookingRow[]) ?? [];
}

export function ownerCover(p: OwnerPropertyRow): string | null {
  const imgs = p.property_images ?? [];
  if (!imgs.length) return null;
  return [...imgs].sort(
    (a, b) => Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
  )[0].url;
}
