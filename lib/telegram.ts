import type { BookingPayload } from "@/types/property";
import { formatDateHuman, formatSom, pluralGuests } from "@/lib/utils";

export function buildTelegramMessage(b: BookingPayload): string {
  return [
    "🏠 <b>Новая заявка IK-HOUSE</b>",
    "",
    `Объект: <b>${b.propertyName}</b>`,
    "",
    `👤 ${b.name}`,
    `📞 ${b.phone}`,
    `📅 ${formatDateHuman(b.checkIn)} — ${formatDateHuman(b.checkOut)} (${b.nights} ноч.)`,
    `👥 ${pluralGuests(b.guests)}`,
    "",
    `💰 <b>${formatSom(b.totalPrice)} сом</b>`,
    b.comment ? `\n💬 ${b.comment}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

/**
 * Отправляет заявку в Telegram. Если переменные окружения не заданы —
 * не падает, а логирует заявку в консоль и возвращает false.
 */
export async function sendToTelegram(b: BookingPayload): Promise<boolean> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const text = buildTelegramMessage(b);

  if (!token || !chatId) {
    console.log("\n[IK-HOUSE] Telegram не настроен. Заявка:\n" + text + "\n");
    return false;
  }

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      },
    );
    if (!res.ok) {
      console.error("[IK-HOUSE] Telegram API error:", await res.text());
      return false;
    }
    return true;
  } catch (err) {
    console.error("[IK-HOUSE] Telegram request failed:", err);
    return false;
  }
}
