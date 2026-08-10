"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  loginSchema,
  type LoginValues,
  authErrorMessage,
} from "@/lib/auth-validation";
import PasswordInput from "@/components/auth/PasswordInput";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/account";
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setLoading(true);
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });
    if (error) {
      setServerError(authErrorMessage(error.message));
      setLoading(false);
      return;
    }
    router.push(next);
    router.refresh();
  }

  return (
    <div className="card p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold text-ink">Вход</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Рады видеть вас снова на IK-HOUSE
      </p>

      {serverError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          {serverError}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="mt-5 space-y-4"
      >
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            {...register("email")}
            className="input"
            placeholder="you@example.com"
          />
          {errors.email && (
            <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label className="label" htmlFor="password">
              Пароль
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs font-medium text-brand-600 hover:underline"
            >
              Забыли пароль?
            </Link>
          </div>
          <PasswordInput
            id="password"
            autoComplete="current-password"
            {...register("password")}
            placeholder="Ваш пароль"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Войти
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Нет аккаунта?{" "}
        <Link
          href={`/auth/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="font-semibold text-brand-600 hover:underline"
        >
          Зарегистрироваться
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="skeleton h-96 w-full rounded-2xl" />}>
      <LoginForm />
    </Suspense>
  );
}
