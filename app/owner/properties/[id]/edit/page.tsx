import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/db/account";
import { requireOwner } from "@/lib/db/owner";
import PropertyWizard, {
  emptyWizardData,
  type WizardData,
} from "@/components/owner/PropertyWizard";
import type { Amenity, PropertyType, Shore } from "@/types/property";

export const dynamic = "force-dynamic";

export default async function EditPropertyPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/owner/properties");
  const owner = await requireOwner();

  const supabase = createClient();
  const { data: p } = await supabase
    .from("properties")
    .select(
      `
      id, owner_id, status, title, type, description, shore, location, address,
      distance_to_beach, max_guests, bedrooms, beds, bathrooms, area,
      price_per_night, old_price,
      property_images ( id, url, sort_order, is_cover ),
      property_amenities ( amenity_key )
    `,
    )
    .eq("id", params.id)
    .maybeSingle();

  if (!p || p.owner_id !== owner.id) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const { data: avail } = await supabase
    .from("property_availability")
    .select("date, status")
    .eq("property_id", p.id)
    .eq("status", "blocked")
    .gte("date", today);

  const images = [...(p.property_images ?? [])]
    .sort(
      (a, b) =>
        Number(b.is_cover) - Number(a.is_cover) || a.sort_order - b.sort_order,
    )
    .map((img, i) => ({
      id: img.id as string,
      url: img.url as string,
      sort_order: i,
    }));

  const initial: WizardData = {
    ...emptyWizardData(),
    id: p.id as string,
    status: p.status as string,
    title: p.title ?? "",
    type: (p.type ?? "cottage") as PropertyType,
    description: p.description ?? "",
    shore: (p.shore ?? "north") as Shore,
    location: p.location ?? "",
    address: p.address ?? "",
    distanceToBeach: p.distance_to_beach ? String(p.distance_to_beach) : "",
    maxGuests: p.max_guests ?? 4,
    bedrooms: p.bedrooms ?? 1,
    beds: p.beds ?? 1,
    bathrooms: p.bathrooms ?? 1,
    area: p.area ? String(p.area) : "",
    amenities: (p.property_amenities ?? []).map(
      (a: { amenity_key: string }) => a.amenity_key as Amenity,
    ),
    images,
    price: p.price_per_night ? String(p.price_per_night) : "",
    oldPrice: p.old_price ? String(p.old_price) : "",
    blockedDates: (avail ?? []).map((a) => a.date as string),
  };

  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold text-ink">
        Редактирование: {p.title || "Без названия"}
      </h1>
      <PropertyWizard initial={initial} userId={session.user.id} />
    </div>
  );
}
