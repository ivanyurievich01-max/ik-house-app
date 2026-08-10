"use client";

import { PRICE_MAX, PRICE_MIN } from "@/lib/constants";
import { formatSom } from "@/lib/utils";

export default function PriceRange({
  min,
  max,
  onChange,
}: {
  min: number;
  max: number;
  onChange: (next: { min: number; max: number }) => void;
}) {
  const clamp = (v: number) => Math.min(PRICE_MAX, Math.max(PRICE_MIN, v));

  return (
    <div>
      <div className="relative h-6">
        {/* Трек */}
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-slate-200" />
        <div
          className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-brand-500"
          style={{
            left: `${((min - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
            right: `${100 - ((max - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100}%`,
          }}
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={min}
          aria-label="Минимальная цена"
          onChange={(e) => {
            const v = Math.min(Number(e.target.value), max - 500);
            onChange({ min: clamp(v), max });
          }}
          className="pointer-events-none absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
        />
        <input
          type="range"
          min={PRICE_MIN}
          max={PRICE_MAX}
          step={500}
          value={max}
          aria-label="Максимальная цена"
          onChange={(e) => {
            const v = Math.max(Number(e.target.value), min + 500);
            onChange({ min, max: clamp(v) });
          }}
          className="pointer-events-none absolute top-1/2 h-1 w-full -translate-y-1/2 appearance-none bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-brand-500 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow"
        />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1">
          <span className="mb-1 block text-[11px] text-ink-muted">от</span>
          <input
            type="number"
            value={min}
            min={PRICE_MIN}
            max={max}
            step={500}
            onChange={(e) =>
              onChange({ min: clamp(Number(e.target.value) || PRICE_MIN), max })
            }
            className="input py-2 text-sm"
          />
        </div>
        <span className="mt-5 text-slate-400">—</span>
        <div className="flex-1">
          <span className="mb-1 block text-[11px] text-ink-muted">до</span>
          <input
            type="number"
            value={max}
            min={min}
            max={PRICE_MAX}
            step={500}
            onChange={(e) =>
              onChange({ min, max: clamp(Number(e.target.value) || PRICE_MAX) })
            }
            className="input py-2 text-sm"
          />
        </div>
      </div>
      <p className="mt-2 text-xs text-ink-muted">
        {formatSom(min)} — {formatSom(max)} сом за ночь
      </p>
    </div>
  );
}
