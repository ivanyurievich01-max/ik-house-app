"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Loader2,
  CheckCircle2,
  AlertCircle,
  Camera,
  BadgeCheck,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  profileSchema,
  type ProfileValues,
  normalizePhone,
} from "@/lib/auth-validation";

type Initial = {
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string | null;
  email: string;
  emailVerified: boolean;
  phoneVerified: boolean;
};

export default function ProfileForm({ initial }: { initial: Initial }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(initial.avatarUrl);
  const [uploading, setUploading] = useState(false);
  const [email, setEmail] = useState(initial.email);
  const [emailMsg, setEmailMsg] = useState("");
  const [emailSaving, setEmailSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: initial.firstName,
      lastName: initial.lastName,
      phone: initial.phone,
    },
  });

  async function uploadAvatar(file: File) {
    setUploading(true);
    setError("");
    try {
      if (!file.type.startsWith("image/")) {
        throw new Error("Можно загрузить только изображение");
      }
      if (file.size > 4 * 1024 * 1024) {
        throw new Error("Файл слишком большой (до 4 МБ)");
      }
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("Не авторизован");

      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("avatars")
        .upload(path, file, { upsert: true });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from("avatars").getPublicUrl(path);
      const url = pub.publicUrl;

      const { error: dbErr } = await supabase
        .from("profiles")
        .update({ avatar_url: url })
        .eq("id", user.id);
      if (dbErr) throw dbErr;

      setAvatarUrl(url);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Не удалось загрузить фото");
    } finally {
      setUploading(false);
    }
  }

  async function onSubmit(values: ProfileValues) {
    setSaving(true);
    setSaved(false);
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setError("Сессия истекла. Войдите заново.");
      setSaving(false);
      return;
    }
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({
        first_name: values.firstName.trim(),
        last_name: values.lastName.trim(),
        phone: normalizePhone(values.phone),
      })
      .eq("id", user.id);
    setSaving(false);
    if (dbErr) {
      setError("Не удалось сохранить изменения");
      return;
    }
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 3000);
  }

  async function changeEmail() {
    if (!email.trim() || email.trim() === initial.email) return;
    setEmailSaving(true);
    setEmailMsg("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser(
      { email: email.trim() },
      {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account/profile`,
      },
    );
    setEmailSaving(false);
    if (error) {
      setEmailMsg("Не удалось изменить email. Попробуйте позже.");
      return;
    }
    setEmailMsg(
      "Мы отправили письмо на новый адрес — подтвердите его, чтобы изменения вступили в силу.",
    );
  }

  const initialLetter = (initial.firstName || "И").charAt(0).toUpperCase();

  return (
    <div className="space-y-6">
      {/* Аватар */}
      <div className="card flex items-center gap-4 p-5">
        <div className="relative">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Фото профиля"
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <span className="grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-2xl font-bold text-white">
              {initialLetter}
            </span>
          )}
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            aria-label="Загрузить фото"
            className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border border-slate-200 bg-white text-ink-soft shadow-sm hover:text-brand-600"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Camera className="h-4 w-4" />
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) uploadAvatar(f);
              e.target.value = "";
            }}
          />
        </div>
        <div>
          <div className="font-bold text-ink">Фото профиля</div>
          <div className="text-sm text-ink-muted">
            JPG или PNG, до 4 МБ
          </div>
        </div>
      </div>

      {/* Статусы */}
      <div className="flex flex-wrap gap-2">
        <span
          className={`chip ${initial.emailVerified ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
        >
          <BadgeCheck className="mr-1 h-3.5 w-3.5" />
          {initial.emailVerified ? "Email подтверждён" : "Email не подтверждён"}
        </span>
        <span
          className={`chip ${initial.phoneVerified ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-ink-muted"}`}
        >
          {initial.phoneVerified
            ? "Телефон подтверждён"
            : "Телефон не подтверждён"}
        </span>
      </div>

      {/* Основная форма */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-4 p-5">
        {error && (
          <div className="flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            {error}
          </div>
        )}
        {saved && (
          <div className="flex items-start gap-2 rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            Профиль сохранён
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="firstName">
              Имя
            </label>
            <input id="firstName" {...register("firstName")} className="input" />
            {errors.firstName && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.firstName.message}
              </p>
            )}
          </div>
          <div>
            <label className="label" htmlFor="lastName">
              Фамилия
            </label>
            <input id="lastName" {...register("lastName")} className="input" />
            {errors.lastName && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            inputMode="tel"
            {...register("phone")}
            className="input"
            placeholder="+996 555 123 456"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>
          )}
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          Сохранить изменения
        </button>
      </form>

      {/* Email */}
      <div className="card space-y-3 p-5">
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
          />
        </div>
        {emailMsg && (
          <p className="text-sm text-ink-soft">{emailMsg}</p>
        )}
        <button
          type="button"
          onClick={changeEmail}
          disabled={emailSaving || email.trim() === initial.email}
          className="btn-outline"
        >
          {emailSaving && <Loader2 className="h-4 w-4 animate-spin" />}
          Изменить email
        </button>
        <p className="text-xs text-ink-muted">
          После смены адреса потребуется подтверждение по ссылке из письма.
        </p>
      </div>
    </div>
  );
}
