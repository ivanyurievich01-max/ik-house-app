"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  UserRound,
  CalendarCheck,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Обзор", href: "/account", icon: LayoutDashboard },
  { label: "Мой профиль", href: "/account/profile", icon: UserRound },
  { label: "Мои заявки", href: "/account/bookings", icon: CalendarCheck },
  { label: "Избранное", href: "/account/favorites", icon: Heart },
];

export default function AccountNav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:pb-0">
      {ITEMS.map((item) => {
        const active =
          item.href === "/account"
            ? pathname === "/account"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
              active
                ? "bg-brand-50 text-brand-700"
                : "text-ink-soft hover:bg-slate-100 hover:text-ink",
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
