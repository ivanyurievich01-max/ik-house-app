import { DEVELOPER_CONTACTS as DEV } from "@/lib/constants";

/* Брендовые иконки Instagram/WhatsApp: в используемой версии lucide-react
 * их нет, поэтому — компактные inline-SVG в той же стилистике (currentColor). */

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12.04 2c-5.46 0-9.9 4.44-9.9 9.9 0 1.75.46 3.45 1.32 4.95L2 22l5.3-1.39a9.87 9.87 0 0 0 4.74 1.21c5.46 0 9.9-4.44 9.9-9.9S17.5 2 12.04 2zm0 18.02c-1.48 0-2.94-.4-4.2-1.15l-.3-.18-3.13.82.84-3.05-.2-.32a8.16 8.16 0 0 1-1.25-4.34c0-4.52 3.68-8.2 8.2-8.2s8.2 3.68 8.2 8.2-3.64 8.22-8.16 8.22zm4.5-6.15c-.25-.12-1.46-.72-1.68-.8-.23-.09-.4-.13-.56.12-.16.25-.64.8-.78.97-.14.16-.29.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.42-.56-.43h-.48c-.16 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.6.19 1.13.16 1.56.1.48-.07 1.46-.6 1.67-1.18.2-.57.2-1.05.14-1.16-.06-.1-.22-.16-.47-.28z" />
    </svg>
  );
}

export default function DeveloperCredit() {
  const waHref = `https://wa.me/${DEV.whatsappNumber}?text=${encodeURIComponent(
    DEV.whatsappMessage,
  )}`;

  return (
    <div className="border-t border-slate-100">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-1 gap-y-0 py-2 text-xs text-ink-muted sm:justify-start">
        <span className="px-1 py-2.5">
          Сайт разработал{" "}
          <span className="font-semibold text-ink-soft">{DEV.name}</span>
        </span>
        <span className="hidden select-none sm:inline" aria-hidden="true">
          ·
        </span>
        <a
          href={DEV.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          title="Instagram Ивана Юрьевича"
          aria-label="Instagram Ивана Юрьевича"
          className="inline-flex items-center gap-1.5 px-2 py-2.5 text-ink-muted transition-colors hover:text-brand-600"
        >
          <InstagramIcon className="h-3.5 w-3.5" /> Instagram
        </a>
        <span className="select-none" aria-hidden="true">
          ·
        </span>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          title="Написать разработчику в WhatsApp"
          aria-label="Написать разработчику в WhatsApp"
          className="inline-flex items-center gap-1.5 px-2 py-2.5 text-ink-muted transition-colors hover:text-emerald-600"
        >
          <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp
        </a>
      </div>
    </div>
  );
}
