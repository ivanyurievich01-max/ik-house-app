"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { ids, ready } = useFavorites();
  const count = ready ? ids.length : 0;

  // На главной header лежит поверх Hero (прозрачный, белый текст);
  // после скролла плавно становится обычным белым.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onHero = pathname === "/" && !scrolled && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b transition-colors duration-300",
        onHero
          ? "header-on-hero border-transparent bg-transparent"
          : "border-slate-200 bg-white/85 backdrop-blur-md",
      )}
    >
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo variant={onHero ? "white" : "dark"} />

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                onHero
                  ? "text-white/90 hover:bg-white/10 hover:text-white"
                  : "text-ink-soft hover:bg-slate-100 hover:text-ink",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <Link
            href="/favorites"
            className={cn(
              "relative hidden items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition sm:inline-flex",
              onHero
                ? "text-white/90 hover:bg-white/10 hover:text-white"
                : "text-ink-soft hover:bg-slate-100",
            )}
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
            className={cn(
              "relative grid h-9 w-9 place-items-center rounded-lg sm:hidden",
              onHero
                ? "text-white hover:bg-white/10"
                : "text-ink-soft hover:bg-slate-100",
            )}
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
            className={cn(
              "grid h-9 w-9 place-items-center rounded-lg lg:hidden",
              onHero ? "text-white hover:bg-white/10" : "text-ink hover:bg-slate-100",
            )}
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
