import { MapPin } from "lucide-react";

/**
 * Карта расположения на OpenStreetMap (без API-ключа).
 * Показываем приблизительную локацию, а не точный адрес.
 */
export default function MapBlock({
  lat,
  lng,
  label,
}: {
  lat: number;
  lng: number;
  label: string;
}) {
  const d = 0.03;
  const bbox = `${lng - d},${lat - d},${lng + d},${lat + d}`;
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div>
      <div className="mb-3 flex items-center gap-2 text-sm text-ink-soft">
        <MapPin className="h-4 w-4 text-brand-500" />
        {label}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 shadow-card">
        <iframe
          title={`Карта: ${label}`}
          src={src}
          className="h-72 w-full"
          loading="lazy"
        />
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        Показана приблизительная локация. Точный адрес владелец сообщит после
        подтверждения бронирования.
      </p>
    </div>
  );
}
