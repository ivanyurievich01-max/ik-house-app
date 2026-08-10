"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/auth/PasswordInput";

function ResetPasswordForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [ready, setReady] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const code = sp.get("code");

    async function prepare() {
      // Ссылка из письма содержит code — обменяем его на сессию
      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          setInvalid(true);
          setReady(true);
          return;
        }
        setReady(true);
        return;
      }
      // Либо сессия уже установлена (например, recovery-редирект)
      const { data } = await supabase.auth.getUser();
      if (!data.user) setInvalid(true);
      setReady(true);
    }
    prepare();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 8) {
      setError("Пароль должен быть не короче 8 символов");
      return;
    }
    if (password !== confirm) {
      setError("Пароли не совпадают");
      return;
    }
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError("Не удалось обновить пароль. Запросите новую ссылку.");
      return;
    }
    setDone(true);
    setTimeout(() => {
      router.push("/account");
      router.refresh();
    }, 1500);
  }

  if (!ready) {
    return <div className="skeleton h-72 w-full rounded-2xl" />;
  }

  if (invalid) {
    return (
      <div className="card p-6 text-center sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50">
          <AlertCircle className="h-8 w-8 text-rose-500" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          Ссылка недействительна
        </h1>
        <p className="mt-2 text-ink-soft">
          Ссылка устарела или уже была использована. Запросите новую.
        </p>
        <a href="/auth/forgot-password" className="btn-primary mt-6 justify-center">
          Запросить новую ссылку
        </a>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-6 text-center sm:p-8">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-ink">
          Пароль обновлён
        </h1>
        <p className="mt-2 text-ink-soft">Перенаправляем в личный кабинет…</p>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold text-ink">Новый пароль</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Придумайте новый пароль для вашего аккаунта.
      </p>

      {error && <p className="mt-3 text-sm text-rose-500">{error}</p>}

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <div>
          <label className="label" htmlFor="password">
            Новый пароль
          </label>
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Минимум 8 символов"
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="label" htmlFor="confirm">
            Повторите пароль
          </label>
          <PasswordInput
            id="confirm"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Ещё раз пароль"
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Сохранить пароль
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="skeleton h-72 w-full rounded-2xl" />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
