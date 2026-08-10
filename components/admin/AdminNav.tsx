"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  Users,
  KeyRound,
  CalendarCheck,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Обзор", href: "/admin", icon: LayoutDashboard },
  { label: "Модерация объектов", href: "/admin/properties", icon: Home },
  { label: "Владельцы", href: "/admin/owners", icon: KeyRound },
  { label: "Пользователи", href: "/admin/users", icon: Users },
  { label: "Бронирования", href: "/admin/bookings", icon: CalendarCheck },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-3 hidden items-center gap-2 lg:flex">
        <ShieldCheck className="h-5 w-5 text-brand-600" />
        <span className="font-bold text-ink">Админ IK-HOUSE</span>
      </div>
      <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:pb-0">
        {ITEMS.map((item) => {
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-11 shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition",
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
    </div>
  );
}
