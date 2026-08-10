import { z } from "zod";
import { todayISO } from "@/lib/utils";

// Телефон Кыргызстана: +996 XXX XXX XXX (допускаем пробелы/дефисы)
const KG_PHONE = /^\+?996[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;

export const bookingSchema = z
  .object({
    name: z.string().trim().min(2, "Введите имя"),
    phone: z
      .string()
      .trim()
      .regex(KG_PHONE, "Укажите корректный номер: +996 555 123 456"),
    email: z
      .string()
      .trim()
      .email("Укажите корректный email")
      .optional()
      .or(z.literal("")),
    checkIn: z.string().min(1, "Выберите дату заезда"),
    checkOut: z.string().min(1, "Выберите дату выезда"),
    guests: z
      .number({ message: "Укажите количество гостей" })
      .int()
      .min(1, "Укажите количество гостей"),
    comment: z.string().trim().max(600, "Слишком длинный комментарий").optional(),
  })
  .refine((d) => d.checkIn >= todayISO(), {
    path: ["checkIn"],
    message: "Дата заезда не может быть в прошлом",
  })
  .refine((d) => d.checkOut > d.checkIn, {
    path: ["checkOut"],
    message: "Дата выезда должна быть позже даты заезда",
  });

export type BookingFormValues = z.infer<typeof bookingSchema>;
