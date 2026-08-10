"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

// Локальный SVG-заглушка (озеро+горы), встроенный data-URL — работает офлайн.
const FALLBACK =
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='1200' height='800'>
      <defs>
        <linearGradient id='g' x1='0' y1='0' x2='0' y2='1'>
          <stop offset='0' stop-color='#bfd7fe'/>
          <stop offset='0.55' stop-color='#93bbfd'/>
          <stop offset='1' stop-color='#06b6d4'/>
        </linearGradient>
      </defs>
      <rect width='1200' height='800' fill='url(#g)'/>
      <path d='M0 560 L280 380 L470 520 L720 320 L980 520 L1200 400 L1200 800 L0 800 Z' fill='#1b356b' opacity='0.35'/>
      <path d='M0 640 L1200 640 L1200 800 L0 800 Z' fill='#0e7490' opacity='0.55'/>
      <text x='50%' y='52%' text-anchor='middle' font-family='sans-serif' font-size='46' fill='#ffffff' opacity='0.85'>IK-HOUSE · Иссык-Куль</text>
    </svg>`,
  );

type Props = Omit<ImageProps, "src" | "onError"> & {
  src: string;
};

export default function SafeImage({ src, className, alt, ...rest }: Props) {
  const [errored, setErrored] = useState(false);
  return (
    <Image
      {...rest}
      alt={alt}
      src={errored ? FALLBACK : src}
      unoptimized
      className={cn(className)}
      onError={() => setErrored(true)}
    />
  );
}
