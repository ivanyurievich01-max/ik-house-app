import { Phone, MessageCircle } from "lucide-react";
import type { Owner } from "@/types/property";
import SafeImage from "@/components/ui/SafeImage";

export default function OwnerCard({
  owner,
  propertyTitle,
}: {
  owner: Owner;
  propertyTitle: string;
}) {
  const waText = encodeURIComponent(
    `Здравствуйте! Интересует бронирование объекта «${propertyTitle}» на IK-HOUSE.`,
  );
  return (
    <div className="card p-5">
      <div className="flex items-center gap-3">
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full">
          <SafeImage
            src={owner.avatar}
            alt={owner.name}
            fill
            sizes="56px"
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-bold text-ink">{owner.name}</div>
          <div className="text-sm text-ink-muted">{owner.role}</div>
          {owner.responseTime && (
            <div className="mt-0.5 text-xs text-emerald-600">
              {owner.responseTime}
            </div>
          )}
        </div>
      </div>

      <a
        href={`tel:${owner.phone.replace(/\s/g, "")}`}
        className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-semibold text-ink transition hover:border-brand-400"
      >
        <Phone className="h-4 w-4" /> {owner.phone}
      </a>

      <a
        href={`https://wa.me/${owner.whatsapp}?text=${waText}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-3 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-600"
      >
        <MessageCircle className="h-4 w-4" /> Написать в WhatsApp
      </a>
    </div>
  );
}
