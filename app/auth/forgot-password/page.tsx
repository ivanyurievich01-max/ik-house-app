"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2, MailCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) {
      setError("Введите email");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError("Не удалось отправить письмо. Проверьте email и попробуйте снова.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="card p-6 text-center sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-brand-50">
          <MailCheck className="h-8 w-8 text-brand-600" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          Проверьте почту
        </h1>
        <p className="mt-2 text-ink-soft">
          Если аккаунт с адресом{" "}
          <span className="font-semibold text-ink">{email}</span> существует, мы
          отправили на него ссылку для восстановления пароля.
        </p>
        <Link href="/auth/login" className="btn-primary mt-6 justify-center">
          Вернуться ко входу
        </Link>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold text-ink">
        Восстановление пароля
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Укажите email — пришлём ссылку для установки нового пароля.
      </p>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
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
            placeholder="you@example.com"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Отправить ссылку
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Вспомнили пароль?{" "}
        <Link
          href="/auth/login"
          className="font-semibold text-brand-600 hover:underline"
        >
          Войти
        </Link>
      </p>
    </div>
  );
}
