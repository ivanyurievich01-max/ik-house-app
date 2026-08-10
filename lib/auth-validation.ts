import { z } from "zod";

export const KG_PHONE = /^\+?996[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;

export function normalizePhone(p: string): string {
  const digits = p.replace(/[^0-9+]/g, "");
  return digits.startsWith("+") ? digits : "+" + digits;
}

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Введите имя"),
    lastName: z.string().trim().min(2, "Введите фамилию"),
    email: z.string().trim().email("Укажите корректный email"),
    phone: z
      .string()
      .trim()
      .regex(KG_PHONE, "Укажите корректный номер: +996 555 123 456"),
    password: z.string().min(8, "Минимум 8 символов"),
    passwordConfirm: z.string(),
    terms: z.literal(true, {
      message: "Необходимо принять условия использования",
    }),
  })
  .refine((d) => d.password === d.passwordConfirm, {
    path: ["passwordConfirm"],
    message: "Пароли не совпадают",
  });

export type RegisterValues = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().trim().email("Укажите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const profileSchema = z.object({
  firstName: z.string().trim().min(2, "Введите имя"),
  lastName: z.string().trim().min(2, "Введите фамилию"),
  phone: z
    .string()
    .trim()
    .regex(KG_PHONE, "Укажите корректный номер: +996 555 123 456"),
});

export type ProfileValues = z.infer<typeof profileSchema>;

/** Человекочитаемые ошибки Supabase Auth */
export function authErrorMessage(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials"))
    return "Неверный email или пароль";
  if (m.includes("email not confirmed"))
    return "Email не подтверждён. Проверьте почту и перейдите по ссылке из письма.";
  if (m.includes("user already registered"))
    return "Пользователь с таким email уже зарегистрирован";
  if (m.includes("password should be at least"))
    return "Пароль слишком короткий (минимум 8 символов)";
  if (m.includes("rate limit") || m.includes("too many requests"))
    return "Слишком много попыток. Подождите немного и попробуйте снова.";
  if (m.includes("network"))
    return "Проблема с сетью. Проверьте подключение к интернету.";
  return "Не удалось выполнить действие. Попробуйте ещё раз.";
}
