"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { KG_PHONE, normalizePhone } from "@/lib/auth-validation";

const OWNER_TYPES = [
  { value: "individual", label: "Частное лицо" },
  { value: "entrepreneur", label: "ИП" },
  { value: "company", label: "Компания" },
] as const;

export default function OnboardingForm({
  defaults,
}: {
  defaults: { firstName: string; lastName: string; phone: string };
}) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(
    [defaults.firstName, defaults.lastName].filter(Boolean).join(" "),
  );
  const [phone, setPhone] = useState(defaults.phone);
  const [whatsapp, setWhatsapp] = useState(defaults.phone);
  const [ownerType, setOwnerType] =
    useState<(typeof OWNER_TYPES)[number]["value"]>("individual");
  const [about, setAbout] = useState("");
  const [terms, setTerms] = useState(false);
  const [showContact, setShowContact] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (displayName.trim().length < 2) {
      setError("Укажите имя или название");
      return;
    }
    if (!KG_PHONE.test(phone.trim())) {
      setError("Укажите корректный телефон: +996 555 123 456");
      return;
    }
    if (!terms) {
      setError("Подтвердите, что имеете право размещать объекты");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Сессия истекла. Войдите заново.");
      setLoading(false);
      return;
    }
    const wa = normalizePhone(whatsapp.trim() || phone.trim()).replace("+", "");
    const { error: dbErr } = await supabase.from("owner_profiles").insert({
      user_id: user.id,
      owner_type: ownerType,
      display_name: displayName.trim(),
      whatsapp: wa,
      public_phone: normalizePhone(phone.trim()),
      about: about.trim() || null,
      show_public_contact: showContact,
      verification_status: "pending",
    });
    setLoading(false);
    if (dbErr) {
      setError(
        dbErr.code === "23505"
          ? "Вы уже зарегистрированы как владелец"
          : "Не удалось сохранить. Попробуйте ещё раз.",
      );
      return;
    }
    router.push("/owner");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="card space-y-4 p-5 sm:p-6">
      {error && (
        <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="label" htmlFor="displayName">
          Имя или название
        </label>
        <input
          id="displayName"
          className="input"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="Как вас видят гости"
          autoComplete="name"
        />
      </div>

      <div>
        <span className="label">Тип владельца</span>
        <div className="mt-1 grid grid-cols-3 gap-2">
          {OWNER_TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setOwnerType(t.value)}
              className={`min-h-11 rounded-xl border px-2 py-2.5 text-sm font-medium transition ${
                ownerType === t.value
                  ? "border-brand-500 bg-brand-50 text-brand-700"
                  : "border-slate-200 text-ink-soft hover:border-slate-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="ownerPhone">
            Телефон
          </label>
          <input
            id="ownerPhone"
            className="input"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+996 555 123 456"
          />
        </div>
        <div>
          <label className="label" htmlFor="ownerWa">
            WhatsApp
          </label>
          <input
            id="ownerWa"
            className="input"
            type="tel"
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="Если отличается от телефона"
          />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="about">
          О себе <span className="text-ink-muted">(необязательно)</span>
        </label>
        <textarea
          id="about"
          className="input min-h-24"
          value={about}
          onChange={(e) => setAbout(e.target.value)}
          placeholder="Пара слов о вас и вашем жилье"
          maxLength={600}
        />
      </div>

      <label className="flex items-start gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={showContact}
          onChange={(e) => setShowContact(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        Показывать мой телефон и WhatsApp гостям на странице объекта
      </label>

      <label className="flex items-start gap-2.5 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={terms}
          onChange={(e) => setTerms(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
        />
        Я подтверждаю, что имею право размещать предлагаемые объекты
      </label>

      <button type="submit" disabled={loading} className="btn-primary w-full justify-center">
        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
        Стать владельцем
      </button>

      <p className="text-xs text-ink-muted">
        После регистрации профиль владельца проходит проверку администратором
        IK-HOUSE. Вы уже можете добавлять объекты — они появятся в каталоге
        после модерации.
      </p>
    </form>
  );
}
