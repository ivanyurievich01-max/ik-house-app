import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, Users, BedDouble, Bath } from "lucide-react";
import { requireAdmin } from "@/lib/db/admin";
import { createClient } from "@/lib/supabase/server";
import { mapRow, PROPERTY_SELECT, type DbRow } from "@/lib/db/properties";
import { SHORE_LABELS, TYPE_LABELS } from "@/lib/constants";
import {
  PROPERTY_STATUS_LABELS,
  PROPERTY_STATUS_STYLES,
} from "@/lib/property-status";
import Gallery from "@/components/property/Gallery";
import AmenitiesGrid from "@/components/property/AmenitiesGrid";
import MapBlock from "@/components/property/MapBlock";
import OwnerCard from "@/components/property/OwnerCard";
import { priceLabel } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminPropertyPreviewPage({
  params,
}: {
  params: { id: string };
}) {
  await requireAdmin();

  const supabase = createClient();
  const { data } = await supabase
    .from("properties")
    .select(`${PROPERTY_SELECT}, status`)
    .eq("id", params.id)
    .maybeSingle();
  if (!data) notFound();

  const property = mapRow(data as unknown as DbRow);
  const status = (data as { status: string }).status;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/admin/properties"
          className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" /> К модерации
        </Link>
        <span className={`chip ${PROPERTY_STATUS_STYLES[status] ?? ""}`}>
          {PROPERTY_STATUS_LABELS[status] ?? status}
        </span>
      </div>

      <div className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm text-amber-800">
        Предпросмотр для модерации — так объявление увидят гости.
      </div>

      <div className="mt-5">
        <Gallery
          images={property.images}
          title={property.title}
          propertyId={property.id}
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <span className="chip mb-2 bg-brand-50 text-brand-700">
            {TYPE_LABELS[property.type]}
          </span>
          <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
            {property.title}
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-brand-500" />
              {property.location}, {SHORE_LABELS[property.shore]}
              {property.distanceToBeach
                ? ` · ${property.distanceToBeach} м до берега`
                : ""}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-soft">
            <span className="inline-flex items-center gap-1.5">
              <Users className="h-4 w-4 text-ink-muted" /> до {property.guests} гостей
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BedDouble className="h-4 w-4 text-ink-muted" /> {property.bedrooms} сп. ·{" "}
              {property.beds} кр.
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Bath className="h-4 w-4 text-ink-muted" /> {property.bathrooms} с/у
            </span>
            <span className="font-bold text-ink">
              {priceLabel(property.pricePerNight)} / ночь
            </span>
          </div>

          <hr className="my-6 border-slate-100" />
          <h2 className="mb-2 text-lg font-bold text-ink">Об объекте</h2>
          <p className="whitespace-pre-line text-ink-soft">
            {property.description || "—"}
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
        </div>

        <aside className="lg:col-span-1">
          <OwnerCard owner={property.owner} propertyTitle={property.title} />
        </aside>
      </div>
    </div>
  );
}
