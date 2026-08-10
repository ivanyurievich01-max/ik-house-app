"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export default function ShareButton({
  title,
  text,
}: {
  title: string;
  text?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, text: text ?? title, url });
        return;
      } catch {
        /* пользователь отменил — ок */
        return;
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={share}
        aria-label="Поделиться объектом"
        className="btn-outline min-h-11 px-3 py-2 text-sm"
      >
        {copied ? (
          <>
            <Check className="h-4 w-4 text-emerald-600" /> Скопировано
          </>
        ) : (
          <>
            <Share2 className="h-4 w-4" /> Поделиться
          </>
        )}
      </button>
    </div>
  );
}
