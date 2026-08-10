"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Home,
  PlusCircle,
  CalendarCheck,
  BadgeCheck,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ITEMS = [
  { label: "Обзор", href: "/owner", icon: LayoutDashboard },
  { label: "Мои объекты", href: "/owner/properties", icon: Home },
  { label: "Добавить объект", href: "/owner/properties/new", icon: PlusCircle },
  { label: "Заявки гостей", href: "/owner/bookings", icon: CalendarCheck },
];

export default function OwnerNav({
  verificationStatus,
  displayName,
}: {
  verificationStatus: string;
  displayName: string;
}) {
  const pathname = usePathname();

  return (
    <div>
      <div className="mb-3 hidden lg:block">
        <div className="truncate font-bold text-ink">{displayName}</div>
        <span
          className={cn(
            "mt-1 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold",
            verificationStatus === "verified"
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700",
          )}
        >
          {verificationStatus === "verified" ? (
            <>
              <BadgeCheck className="h-3.5 w-3.5" /> Проверенный владелец
            </>
          ) : (
            <>
              <Clock className="h-3.5 w-3.5" /> На проверке
            </>
          )}
        </span>
      </div>

      <nav className="flex gap-1 overflow-x-auto pb-2 lg:flex-col lg:gap-1.5 lg:pb-0">
        {ITEMS.map((item) => {
          const active =
            item.href === "/owner"
              ? pathname === "/owner"
              : item.href === "/owner/properties"
                ? pathname === "/owner/properties" ||
                  (pathname.startsWith("/owner/properties/") &&
                    !pathname.endsWith("/new"))
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
