import Link from "next/link";
import { Phone, Mail, Send, MessageCircle } from "lucide-react";
import Logo from "@/components/layout/Logo";
import DeveloperCredit from "@/components/layout/DeveloperCredit";
import { CONTACTS } from "@/lib/constants";

const COLS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Навигация",
    links: [
      { label: "Главная", href: "/" },
      { label: "Каталог", href: "/catalog" },
      { label: "Южный берег", href: "/catalog?shore=south" },
      { label: "Северный берег", href: "/catalog?shore=north" },
      { label: "О нас", href: "/about" },
      { label: "Помощь", href: "/help" },
    ],
  },
  {
    title: "Гостям",
    links: [
      { label: "Как забронировать", href: "/help" },
      { label: "Отмена бронирования", href: "/help" },
      { label: "Частые вопросы", href: "/help" },
      { label: "Поддержка", href: "/contacts" },
    ],
  },
  {
    title: "Владельцам",
    links: [
      { label: "Добавить объект", href: "/contacts" },
      { label: "Условия размещения", href: "/help" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white">
      <div className="container-page grid grid-cols-2 gap-8 py-12 md:grid-cols-5">
        <div className="col-span-2">
          <Logo />
          <p className="mt-3 max-w-xs text-sm text-ink-muted">
            Поиск и бронирование коттеджей, гостевых домов и пансионатов на
            Иссык-Куле напрямую от владельцев.
          </p>
          <div className="mt-4 space-y-2 text-sm">
            <a
              href={`tel:${CONTACTS.phoneHref}`}
              className="flex items-center gap-2 text-ink-soft hover:text-brand-600"
            >
              <Phone className="h-4 w-4" /> {CONTACTS.phone}
            </a>
            <a
              href={`https://wa.me/${CONTACTS.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-soft hover:text-brand-600"
            >
              <MessageCircle className="h-4 w-4" /> WhatsApp
            </a>
            <a
              href={`https://t.me/${CONTACTS.telegram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-ink-soft hover:text-brand-600"
            >
              <Send className="h-4 w-4" /> Telegram
            </a>
            <a
              href={`mailto:${CONTACTS.email}`}
              className="flex items-center gap-2 text-ink-soft hover:text-brand-600"
            >
              <Mail className="h-4 w-4" /> {CONTACTS.email}
            </a>
          </div>
        </div>

        {COLS.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold text-ink">{col.title}</h4>
            <ul className="mt-3 space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="text-sm text-ink-muted hover:text-brand-600"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200">
        <div className="container-page flex flex-col items-center justify-between gap-2 py-4 text-xs text-ink-muted sm:flex-row">
          <span>© 2026 IK-HOUSE. Жильё на Иссык-Куле.</span>
          <span>Сделано для отдыха на самом большом горном озере.</span>
        </div>
      </div>

      <DeveloperCredit />
    </footer>
  );
}
