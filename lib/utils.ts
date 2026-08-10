import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 5500 -> "5 500" */
export function formatSom(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value));
}

export function priceLabel(value: number): string {
  return `${formatSom(value)} сом`;
}

/** Форматирует ISO дату (yyyy-mm-dd) в "12 августа" */
const MONTHS_GEN = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export function formatDateHuman(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}`;
}

export function toISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayISO(): string {
  return toISODate(new Date());
}

/** Количество ночей между двумя ISO-датами (>=0) */
export function nightsBetween(checkIn: string, checkOut: string): number {
  if (!checkIn || !checkOut) return 0;
  const a = new Date(checkIn + "T00:00:00").getTime();
  const b = new Date(checkOut + "T00:00:00").getTime();
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  const diff = Math.round((b - a) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
}

export function pluralNights(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} ночь`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} ночи`;
  return `${n} ночей`;
}

export function pluralGuests(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} гость`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} гостя`;
  return `${n} гостей`;
}

export function pluralReviews(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} отзыв`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20))
    return `${n} отзыва`;
  return `${n} отзывов`;
}

/** Детерминированное псевдослучайное число из строки — чтобы не прыгало между рендерами/SSR */
export function seededInt(seed: string, min: number, max: number): number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const x = (h >>> 0) / 4294967295;
  return Math.floor(min + x * (max - min + 1));
}
