"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  ChevronDown,
  LayoutDashboard,
  CalendarCheck,
  Heart,
  Settings,
  LogOut,
  KeyRound,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const configured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

type ProfileLite = {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
};

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileLite | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const [ready, setReady] = useState(!configured);

  useEffect(() => {
    if (!configured) return;
    const supabase = createClient();

    async function load(u: User | null) {
      setUser(u);
      if (u) {
        const [{ data }, { data: owner }] = await Promise.all([
          supabase
            .from("profiles")
            .select("first_name, last_name, avatar_url")
            .eq("id", u.id)
            .maybeSingle(),
          supabase
            .from("owner_profiles")
            .select("id")
            .eq("user_id", u.id)
            .maybeSingle(),
        ]);
        setProfile((data as ProfileLite) ?? null);
        setIsOwner(!!owner);
      } else {
        setProfile(null);
        setIsOwner(false);
      }
      setReady(true);
    }

    supabase.auth.getUser().then(({ data }) => load(data.user));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      load(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, isOwner, ready };
}

function displayName(user: User, profile: ProfileLite | null): string {
  const name =
    profile?.first_name ||
    (user.user_metadata?.first_name as string | undefined) ||
    "";
  return name || user.email?.split("@")[0] || "Профиль";
}

function Avatar({
  user,
  profile,
  size = "h-7 w-7 text-xs",
}: {
  user: User;
  profile: ProfileLite | null;
  size?: string;
}) {
  const name = displayName(user, profile);
  if (profile?.avatar_url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={profile.avatar_url}
        alt={name}
        className={cn("shrink-0 rounded-full object-cover", size)}
      />
    );
  }
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-brand-600 font-bold text-white",
        size,
      )}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

const MENU = [
  { label: "Личный кабинет", href: "/account", icon: LayoutDashboard },
  { label: "Мои заявки", href: "/account/bookings", icon: CalendarCheck },
  { label: "Избранное", href: "/account/favorites", icon: Heart },
  { label: "Настройки", href: "/account/profile", icon: Settings },
];

function menuFor(isOwner: boolean) {
  return [
    ...MENU,
    isOwner
      ? { label: "Панель владельца", href: "/owner", icon: KeyRound }
      : { label: "Стать владельцем", href: "/owner/onboarding", icon: KeyRound },
  ];
}

export default function UserMenu() {
  const { user, profile, isOwner, ready } = useAuthUser();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    setOpen(false);
    router.push("/");
    router.refresh();
  }

  if (!ready) {
    return <div className="skeleton hidden h-9 w-24 rounded-lg lg:block" />;
  }

  if (!user) {
    return (
      <Link href="/auth/login" className="btn-outline hidden px-3 py-2 lg:inline-flex">
        <UserIcon className="h-4 w-4" />
        Войти
      </Link>
    );
  }

  return (
    <div ref={ref} className="relative hidden lg:block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-ink hover:bg-slate-100"
      >
        <Avatar user={user} profile={profile} />
        <span className="max-w-28 truncate">{displayName(user, profile)}</span>
        <ChevronDown
          className={cn("h-4 w-4 text-ink-muted transition", open && "rotate-180")}
        />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white py-1.5 shadow-lg">
          {menuFor(isOwner).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-ink-soft hover:bg-slate-50 hover:text-ink"
            >
              <item.icon className="h-4 w-4 text-ink-muted" />
              {item.label}
            </Link>
          ))}
          <div className="my-1 border-t border-slate-100" />
          <button
            onClick={signOut}
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-rose-600 hover:bg-rose-50"
          >
            <LogOut className="h-4 w-4" />
            Выйти
          </button>
        </div>
      )}
    </div>
  );
}

/** Блок для мобильного меню */
export function UserMenuMobile({ onNavigate }: { onNavigate?: () => void }) {
  const { user, profile, isOwner, ready } = useAuthUser();
  const router = useRouter();

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    onNavigate?.();
    router.push("/");
    router.refresh();
  }

  if (!ready) return null;

  if (!user) {
    return (
      <Link
        href="/auth/login"
        onClick={onNavigate}
        className="btn-primary mt-2 w-full justify-center"
      >
        <UserIcon className="h-4 w-4" /> Войти
      </Link>
    );
  }

  return (
    <div className="mt-2 border-t border-slate-100 pt-2">
      <div className="flex items-center gap-2.5 px-2 py-2">
        <Avatar user={user} profile={profile} size="h-9 w-9 text-sm" />
        <div className="min-w-0">
          <div className="truncate text-sm font-bold text-ink">
            {displayName(user, profile)}
          </div>
          <div className="truncate text-xs text-ink-muted">{user.email}</div>
        </div>
      </div>
      {menuFor(isOwner).map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className="flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-sm font-medium text-ink-soft hover:bg-slate-100"
        >
          <item.icon className="h-4 w-4 text-ink-muted" />
          {item.label}
        </Link>
      ))}
      <button
        onClick={signOut}
        className="flex w-full items-center gap-2.5 rounded-lg px-2 py-2.5 text-left text-sm font-medium text-rose-600 hover:bg-rose-50"
      >
        <LogOut className="h-4 w-4" />
        Выйти
      </button>
    </div>
  );
}
