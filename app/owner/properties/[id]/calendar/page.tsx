import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getSessionUser } from "@/lib/db/account";
import { requireOwner } from "@/lib/db/owner";
import OwnerCalendar from "@/components/owner/OwnerCalendar";

export const dynamic = "force-dynamic";

export default async function OwnerCalendarPage({
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
    .select("id, owner_id, title")
    .eq("id", params.id)
    .maybeSingle();
  if (!p || p.owner_id !== owner.id) notFound();

  const today = new Date().toISOString().slice(0, 10);
  const { data: avail } = await supabase
    .from("property_availability")
    .select("date, status")
    .eq("property_id", p.id)
    .gte("date", today);

  const blocked = (avail ?? [])
    .filter((a) => a.status === "blocked")
    .map((a) => a.date as string);
  const booked = (avail ?? [])
    .filter((a) => a.status === "booked")
    .map((a) => a.date as string);

  return (
    <div>
      <Link
        href="/owner/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-600"
      >
        <ArrowLeft className="h-4 w-4" /> К моим объектам
      </Link>
      <h1 className="text-2xl font-extrabold text-ink">
        Календарь: {p.title || "Без названия"}
      </h1>
      <p className="mt-1 text-ink-muted">
        Закрывайте даты, когда жильё недоступно. Забронированные даты
        блокируются автоматически.
      </p>
      <div className="card mt-6 max-w-lg p-5 sm:p-6">
        <OwnerCalendar
          propertyId={p.id as string}
          initialBlocked={blocked}
          booked={booked}
        />
      </div>
    </div>
  );
}
