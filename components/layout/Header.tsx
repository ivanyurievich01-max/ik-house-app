"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, Menu, X } from "lucide-react";
import Logo from "@/components/layout/Logo";
import UserMenu, { UserMenuMobile } from "@/components/auth/UserMenu";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Главная", href: "/" },
  { label: "Жильё", href: "/catalog" },
  { label: "Южный берег", href: "/catalog?shore=south" },
  { label: "Северный берег", href: "/catalog?shore=north" },
  { label: "О нас", href: "/about" },
  { label: "Помощь", href: "/help" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { ids, ready } = useFavorites();
  const count = ready ? ids.length : 0;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-slate-100 hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/favorites"
            className="relative hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-ink-soft transition hover:bg-slate-100 sm:inline-flex"
          >
            <Heart className="h-4 w-4" />
            Избранное
            {count > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-rose-500 px-1 text-[11px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <Link
            href="/favorites"
            aria-label="Избранное"
            className="relative grid h-9 w-9 place-items-center rounded-lg text-ink-soft hover:bg-slate-100 sm:hidden"
          >
            <Heart className="h-5 w-5" />
            {count > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {count}
              </span>
            )}
          </Link>

          <UserMenu />

          <button
            type="button"
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink hover:bg-slate-100 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={cn(
          "overflow-hidden border-t border-slate-200 bg-white transition-[max-height] duration-300 lg:hidden",
          open ? "max-h-96" : "max-h-0",
        )}
      >
        <nav className="container-page flex flex-col py-2">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
          <UserMenuMobile onNavigate={() => setOpen(false)} />
        </nav>
      </div>
    </header>
  );
}
