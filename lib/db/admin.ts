import "server-only";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/db/account";

export type AdminStats = {
  users: number;
  owners: number;
  owners_pending: number;
  properties: number;
  published: number;
  pending_review: number;
  bookings: number;
  bookings_pending: number;
};

/** Доступ только для admin — проверка SERVER-SIDE (роль из БД, не из UI) */
export async function requireAdmin() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/admin");
  if (session.profile?.role !== "admin") redirect("/");
  return session;
}

export async function getAdminStats(): Promise<AdminStats> {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("admin_stats");
  if (error || !data) {
    console.error("[IK-HOUSE] admin_stats:", error);
    return {
      users: 0,
      owners: 0,
      owners_pending: 0,
      properties: 0,
      published: 0,
      pending_review: 0,
      bookings: 0,
      bookings_pending: 0,
    };
  }
  return data as AdminStats;
}

export type AdminPropertyRow = {
  id: string;
  slug: string;
  title: string;
  type: string;
  location: string;
  shore: string;
  price_per_night: number;
  status: string;
  rejection_reason: string | null;
  created_at: string;
  owner: { id: string; display_name: string; public_phone: string | null } | null;
  property_images: { url: string; is_cover: boolean; sort_order: number }[];
};

export async function getAdminProperties(
  status?: string,
): Promise<AdminPropertyRow[]> {
  const supabase = createClient();
  let q = supabase
    .from("properties")
    .select(
      `
      id, slug, title, type, location, shore, price_per_night, status,
      rejection_reason, created_at,
      owner:owner_profiles ( id, display_name, public_phone ),
      property_images ( url, is_cover, sort_order )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(100);
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) {
    console.error("[IK-HOUSE] admin properties:", error);
    return [];
  }
  return (data as unknown as AdminPropertyRow[]) ?? [];
}

export type AdminOwnerRow = {
  id: string;
  display_name: string;
  owner_type: string;
  public_phone: string | null;
  whatsapp: string | null;
  about: string | null;
  verification_status: string;
  created_at: string;
  user: {
    id: string;
    first_name: string;
    last_name: string;
    email: string | null;
    status: string;
  } | null;
  properties: { count: number }[];
};

export async function getAdminOwners(): Promise<AdminOwnerRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("owner_profiles")
    .select(
      `
      id, display_name, owner_type, public_phone, whatsapp, about,
      verification_status, created_at,
      user:profiles ( id, first_name, last_name, email, status ),
      properties ( count )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    console.error("[IK-HOUSE] admin owners:", error);
    return [];
  }
  return (data as unknown as AdminOwnerRow[]) ?? [];
}

export type AdminUserRow = {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  role: string;
  status: string;
  created_at: string;
};

export async function getAdminUsers(): Promise<AdminUserRow[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email, phone, role, status, created_at")
    .order("created_at", { ascending: false })
    .limit(300);
  if (error) {
    console.error("[IK-HOUSE] admin users:", error);
    return [];
  }
  return (data as AdminUserRow[]) ?? [];
}

export type AdminBookingRow = {
  id: string;
  booking_number: string;
  guest_first_name: string;
  guest_phone: string;
  check_in: string;
  check_out: string;
  guests: number;
  nights: number;
  total_price: number;
  status: "pending" | "confirmed" | "declined" | "cancelled" | "completed";
  created_at: string;
  property: { title: string; slug: string } | null;
  owner: { display_name: string } | null;
};

export async function getAdminBookings(
  status?: string,
): Promise<AdminBookingRow[]> {
  const supabase = createClient();
  let q = supabase
    .from("bookings")
    .select(
      `
      id, booking_number, guest_first_name, guest_phone, check_in, check_out,
      guests, nights, total_price, status, created_at,
      property:properties ( title, slug ),
      owner:owner_profiles ( display_name )
    `,
    )
    .order("created_at", { ascending: false })
    .limit(200);
  if (status && status !== "all") q = q.eq("status", status);
  const { data, error } = await q;
  if (error) {
    console.error("[IK-HOUSE] admin bookings:", error);
    return [];
  }
  return (data as unknown as AdminBookingRow[]) ?? [];
}
