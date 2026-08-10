import { NextResponse } from "next/server";
import { z } from "zod";
import { sendToTelegram } from "@/lib/telegram";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { getProperty as getMockProperty, properties as mockProperties } from "@/data/properties";
import { nightsBetween } from "@/lib/utils";

const KG_PHONE = /^\+?996[\s-]?\d{3}[\s-]?\d{3}[\s-]?\d{3}$/;

const apiSchema = z.object({
  propertyId: z.string().min(1),
  name: z.string().trim().min(2),
  phone: z.string().trim().regex(KG_PHONE),
  email: z
    .string()
    .trim()
    .email()
    .optional()
    .or(z.literal(""))
    .transform((v) => (v ? v : undefined)),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guests: z.coerce.number().int().min(1).max(50),
  comment: z.string().trim().max(600).optional().default(""),
});

// --- простейший rate limiting по IP (в пределах инстанса) ---
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 10 * 60 * 1000; // 10 минут
const MAX_HITS = 8;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    hits.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count++;
  return rec.count > MAX_HITS;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_NAME: "Укажите имя",
  INVALID_PHONE: "Укажите корректный номер телефона",
  INVALID_DATES: "Проверьте даты заезда и выезда",
  DATES_IN_PAST: "Дата заезда не может быть в прошлом",
  INVALID_GUESTS: "Укажите количество гостей",
  PROPERTY_NOT_FOUND: "Объект не найден или снят с публикации",
  TOO_MANY_GUESTS: "Слишком много гостей для этого объекта",
  DATES_UNAVAILABLE:
    "Выбранные даты уже заняты. Пожалуйста, выберите другие даты.",
};

function dbConfigured(): boolean {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Слишком много заявок. Попробуйте через несколько минут." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Некорректный запрос" },
      { status: 400 },
    );
  }

  const parsed = apiSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Проверьте правильность заполнения формы" },
      { status: 422 },
    );
  }
  const p = parsed.data;
  const normalizedPhone = p.phone.replace(/[^0-9+]/g, "");

  // ---------- Основной путь: Supabase ----------
  if (dbConfigured()) {
    try {
      const supabase = createClient(); // с контекстом пользователя (если вошёл)
      const { data, error } = await supabase.rpc("create_booking", {
        p_property_id: p.propertyId,
        p_check_in: p.checkIn,
        p_check_out: p.checkOut,
        p_guests: p.guests,
        p_first_name: p.name,
        p_phone: normalizedPhone.startsWith("+")
          ? normalizedPhone
          : "+" + normalizedPhone,
        p_email: p.email ?? null,
        p_comment: p.comment || null,
      });

      if (error) {
        const key = Object.keys(ERROR_MESSAGES).find((k) =>
          error.message.includes(k),
        );
        return NextResponse.json(
          {
            ok: false,
            error: key
              ? ERROR_MESSAGES[key]
              : "Не удалось создать заявку. Попробуйте ещё раз.",
          },
          { status: key ? 422 : 500 },
        );
      }

      const result = data as {
        booking_number: string;
        nights: number;
        total_price: number;
        property_title: string;
      };

      // Telegram-уведомление администратору (не блокирует ответ при сбое)
      sendToTelegram({
        propertyId: p.propertyId,
        propertyName: result.property_title,
        name: p.name,
        phone: normalizedPhone,
        checkIn: p.checkIn,
        checkOut: p.checkOut,
        guests: p.guests,
        nights: result.nights,
        totalPrice: result.total_price,
        comment: p.comment,
      }).catch(() => {});

      return NextResponse.json({
        ok: true,
        bookingId: result.booking_number,
        nights: result.nights,
        totalPrice: result.total_price,
      });
    } catch (e) {
      console.error("[IK-HOUSE] Ошибка создания заявки:", e);
      return NextResponse.json(
        { ok: false, error: "Внутренняя ошибка. Попробуйте позже." },
        { status: 500 },
      );
    }
  }

  // ---------- Fallback без БД (dev без env): расчёт по demo-данным ----------
  const mock =
    mockProperties.find((m) => m.id === p.propertyId) ??
    getMockProperty(p.propertyId);
  const nights = nightsBetween(p.checkIn, p.checkOut);
  if (!mock || nights < 1) {
    return NextResponse.json(
      { ok: false, error: "Проверьте даты и объект" },
      { status: 422 },
    );
  }
  const totalPrice = nights * mock.pricePerNight;
  const id = `IK-${10000 + Math.floor(Math.random() * 90000)}`;

  await sendToTelegram({
    propertyId: p.propertyId,
    propertyName: mock.title,
    name: p.name,
    phone: normalizedPhone,
    checkIn: p.checkIn,
    checkOut: p.checkOut,
    guests: p.guests,
    nights,
    totalPrice,
    comment: p.comment,
  }).catch(() => {});

  return NextResponse.json({ ok: true, bookingId: id, nights, totalPrice });
}
