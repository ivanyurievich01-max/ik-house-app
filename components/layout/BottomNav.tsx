"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Heart,
  CalendarCheck,
  UserRound,
  LayoutDashboard,
  PlusCircle,
  Building2,
} from "lucide-react";
import { useFavorites } from "@/components/favorites/FavoritesProvider";
import { cn } from "@/lib/utils";

const GUEST_ITEMS = [
  { label: "Главная", href: "/", icon: Home, exact: true },
  { label: "Поиск", href: "/catalog", icon: Search },
  { label: "Избранное", href: "/favorites", icon: Heart, badge: true },
  { label: "Заявки", href: "/account/bookings", icon: CalendarCheck },
  { label: "Профиль", href: "/account", icon: UserRound, exact: true },
];

const OWNER_ITEMS = [
  { label: "Обзор", href: "/owner", icon: LayoutDashboard, exact: true },
  { label: "Объекты", href: "/owner/properties", icon: Building2, exact: true },
  { label: "Добавить", href: "/owner/properties/new", icon: PlusCircle, accent: true },
  { label: "Заявки", href: "/owner/bookings", icon: CalendarCheck },
  { label: "Профиль", href: "/account", icon: UserRound, exact: true },
];

type Item = {
  label: string;
  href: string;
  icon: typeof Home;
  exact?: boolean;
  badge?: boolean;
  accent?: boolean;
};

/** Скрываем нижнюю навигацию там, где внизу другой sticky-элемент */
function isHidden(pathname: string): boolean {
  if (pathname.startsWith("/property/")) return true; // sticky booking CTA
  if (pathname.startsWith("/booking/")) return true;
  if (pathname.startsWith("/auth/")) return true;
  if (pathname.startsWith("/owner/properties/new")) return true; // мастер
  if (/^\/owner\/properties\/[^/]+\/edit/.test(pathname)) return true;
  if (pathname.startsWith("/admin")) return true;
  return false;
}

export default function BottomNav() {
  const pathname = usePathname();
  const { ids, ready } = useFavorites();
  const favCount = ready ? ids.length : 0;

  if (isHidden(pathname)) return null;

  const items: Item[] = pathname.startsWith("/owner")
    ? OWNER_ITEMS
    : GUEST_ITEMS;

  return (
    <>
      {/* распорка, чтобы контент/footer не прятался под навигацией */}
      <div
        aria-hidden
        className="h-16 lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      />
      <nav
        aria-label="Основная навигация"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-[#0b1630]/95 backdrop-blur lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex h-16 max-w-lg items-stretch">
          {items.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex min-w-0 flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition",
                  active ? "text-brand-400" : "text-slate-400",
                )}
              >
                <span
                  className={cn(
                    "relative grid place-items-center rounded-xl transition",
                    item.accent
                      ? "h-9 w-9 bg-brand-600 text-white shadow-sm"
                      : "h-7 w-9",
                    active && !item.accent && "bg-white/10",
                  )}
                >
                  <item.icon className={item.accent ? "h-5 w-5" : "h-5 w-5"} />
                  {item.badge && favCount > 0 && (
                    <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
                      {favCount}
                    </span>
                  )}
                </span>
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
