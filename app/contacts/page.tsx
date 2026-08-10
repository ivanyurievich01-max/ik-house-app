import type { Metadata } from "next";
import { Phone, Mail, MessageCircle, Send } from "lucide-react";
import { CONTACTS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Контакты",
  description: "Свяжитесь с командой IK-HOUSE.",
};

export default function ContactsPage() {
  const rows = [
    { icon: Phone, label: "Телефон", value: CONTACTS.phone, href: `tel:${CONTACTS.phoneHref}` },
    { icon: MessageCircle, label: "WhatsApp", value: CONTACTS.phone, href: `https://wa.me/${CONTACTS.whatsapp}` },
    { icon: Send, label: "Telegram", value: `@${CONTACTS.telegram}`, href: `https://t.me/${CONTACTS.telegram}` },
    { icon: Mail, label: "Email", value: CONTACTS.email, href: `mailto:${CONTACTS.email}` },
  ];

  return (
    <div className="container-page py-12">
      <div className="mx-auto max-w-xl">
        <h1 className="text-3xl font-extrabold text-ink">Контакты</h1>
        <p className="mt-2 text-ink-muted">
          Мы на связи по будням и в выходные — поможем с бронированием и
          подскажем, что посмотреть на Иссык-Куле.
        </p>

        <div className="mt-8 space-y-3">
          {rows.map((r) => (
            <a
              key={r.label}
              href={r.href}
              target={r.href.startsWith("http") ? "_blank" : undefined}
              rel="noopener noreferrer"
              className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-soft transition hover:border-brand-300"
            >
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <r.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wide text-ink-muted">
                  {r.label}
                </div>
                <div className="font-semibold text-ink">{r.value}</div>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="font-bold text-ink">Владельцам жилья</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Хотите разместить свой объект на IK-HOUSE? Напишите нам в WhatsApp
            или на email — расскажем условия и поможем с публикацией.
          </p>
        </div>
      </div>
    </div>
  );
}
