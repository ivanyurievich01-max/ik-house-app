"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import {
  registerSchema,
  type RegisterValues,
  authErrorMessage,
  normalizePhone,
} from "@/lib/auth-validation";
import PasswordInput from "@/components/auth/PasswordInput";

function RegisterForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: sp.get("name") ?? "",
      email: sp.get("email") ?? "",
      phone: sp.get("phone") ?? "",
    },
  });

  async function onSubmit(values: RegisterValues) {
    setLoading(true);
    setServerError("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/account`,
        data: {
          first_name: values.firstName,
          last_name: values.lastName,
          phone: normalizePhone(values.phone),
        },
      },
    });
    if (error) {
      setServerError(authErrorMessage(error.message));
      setLoading(false);
      return;
    }
    router.push(`/auth/verify-email?email=${encodeURIComponent(values.email)}`);
  }

  return (
    <div className="card p-6 sm:p-8">
      <h1 className="text-2xl font-extrabold text-ink">Регистрация</h1>
      <p className="mt-1 text-sm text-ink-muted">
        Создайте аккаунт, чтобы отслеживать заявки и сохранять избранное
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
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label" htmlFor="firstName">
              Имя
            </label>
            <input
              id="firstName"
              autoComplete="given-name"
              {...register("firstName")}
              className="input"
              placeholder="Иван"
            />
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
            <input
              id="lastName"
              autoComplete="family-name"
              {...register("lastName")}
              className="input"
              placeholder="Иванов"
            />
            {errors.lastName && (
              <p className="mt-1 text-xs text-rose-500">
                {errors.lastName.message}
              </p>
            )}
          </div>
        </div>

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
          <label className="label" htmlFor="phone">
            Телефон
          </label>
          <input
            id="phone"
            inputMode="tel"
            autoComplete="tel"
            {...register("phone")}
            className="input"
            placeholder="+996 555 123 456"
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-rose-500">{errors.phone.message}</p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="password">
            Пароль
          </label>
          <PasswordInput
            id="password"
            autoComplete="new-password"
            {...register("password")}
            placeholder="Минимум 8 символов"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label className="label" htmlFor="passwordConfirm">
            Повторите пароль
          </label>
          <PasswordInput
            id="passwordConfirm"
            autoComplete="new-password"
            {...register("passwordConfirm")}
            placeholder="Ещё раз пароль"
          />
          {errors.passwordConfirm && (
            <p className="mt-1 text-xs text-rose-500">
              {errors.passwordConfirm.message}
            </p>
          )}
        </div>

        <label className="flex items-start gap-2.5 text-sm text-ink-soft">
          <input
            type="checkbox"
            {...register("terms")}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-brand-600"
          />
          <span>
            Я принимаю{" "}
            <Link href="/help" className="text-brand-600 hover:underline">
              условия использования
            </Link>{" "}
            и политику конфиденциальности
          </span>
        </label>
        {errors.terms && (
          <p className="-mt-2 text-xs text-rose-500">{errors.terms.message}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          Создать аккаунт
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-ink-muted">
        Уже есть аккаунт?{" "}
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

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="skeleton h-96 w-full rounded-2xl" />}>
      <RegisterForm />
    </Suspense>
  );
}
