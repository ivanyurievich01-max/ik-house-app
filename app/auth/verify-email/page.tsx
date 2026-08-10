"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

function VerifyEmailContent() {
  const sp = useSearchParams();
  const email = sp.get("email") ?? "";
  const [resent, setResent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function resend() {
    if (!email) return;
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
      },
    });
    setLoading(false);
    if (error) {
      setError("Не удалось отправить письмо. Попробуйте чуть позже.");
      return;
    }
    setResent(true);
  }

  return (
    <div className="card p-6 text-center sm:p-8">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50">
        <MailCheck className="h-8 w-8 text-brand-600" />
      </div>
      <h1 className="mt-4 text-2xl font-extrabold text-ink">
        Подтвердите вашу почту
      </h1>
      <p className="mt-2 text-ink-soft">
        Мы отправили письмо со ссылкой подтверждения
        {email ? (
          <>
            {" "}
            на <span className="font-semibold text-ink">{email}</span>
          </>
        ) : null}
        . Перейдите по ссылке из письма, чтобы активировать аккаунт.
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Письмо может попасть в папку «Спам».
      </p>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}
      {resent && (
        <p className="mt-3 text-sm font-medium text-emerald-600">
          Письмо отправлено повторно ✓
        </p>
      )}

      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
        {email && (
          <button
            onClick={resend}
            disabled={loading || resent}
            className="btn-outline justify-center"
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            Отправить письмо повторно
          </button>
        )}
        <Link href="/auth/register" className="btn-outline justify-center">
          Изменить email
        </Link>
        <Link href="/auth/login" className="btn-primary justify-center">
          Войти
        </Link>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="skeleton h-72 w-full rounded-2xl" />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
