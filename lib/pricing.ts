import { nightsBetween } from "@/lib/utils";

export const SERVICE_FEE_RATE = 0; // сервисный сбор для MVP выключен

export interface PriceBreakdown {
  nights: number;
  pricePerNight: number;
  subtotal: number;
  serviceFee: number;
  total: number;
}

export function calcPrice(
  pricePerNight: number,
  checkIn: string,
  checkOut: string,
): PriceBreakdown {
  const nights = nightsBetween(checkIn, checkOut);
  const subtotal = nights * pricePerNight;
  const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE);
  return {
    nights,
    pricePerNight,
    subtotal,
    serviceFee,
    total: subtotal + serviceFee,
  };
}
