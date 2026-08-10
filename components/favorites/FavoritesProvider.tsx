"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { createClient } from "@/lib/supabase/client";

type Ctx = {
  ids: string[];
  isFavorite: (id: string) => boolean;
  toggle: (id: string) => void;
  ready: boolean;
};

const FavoritesContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "ik-house:favorites";

const configured =
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function readLocal(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return [];
}

function writeLocal(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    /* ignore */
  }
}

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [ids, setIds] = useState<string[]>([]);
  const [ready, setReady] = useState(false);
  const userIdRef = useRef<string | null>(null);

  // Загрузка: localStorage сразу, затем — синхронизация с БД для вошедшего
  useEffect(() => {
    setIds(readLocal());
    setReady(true);

    if (!configured) return;
    const supabase = createClient();

    async function syncWithDb(userId: string) {
      userIdRef.current = userId;
      const local = readLocal();

      const { data, error } = await supabase
        .from("favorites")
        .select("property_id")
        .eq("user_id", userId);
      if (error) return;
      const dbIds = (data ?? []).map((f) => f.property_id as string);

      // merge: локальные, которых нет в БД → добавляем (без дубликатов)
      const missing = local.filter((id) => !dbIds.includes(id));
      if (missing.length) {
        await supabase
          .from("favorites")
          .upsert(
            missing.map((property_id) => ({ user_id: userId, property_id })),
            { onConflict: "user_id,property_id", ignoreDuplicates: true },
          );
      }

      const merged = Array.from(new Set([...dbIds, ...local]));
      setIds(merged);
      writeLocal(merged);
    }

    supabase.auth.getUser().then(({ data }) => {
      if (data.user) syncWithDb(data.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        syncWithDb(session.user.id);
      }
      if (event === "SIGNED_OUT") {
        userIdRef.current = null;
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!ready) return;
    writeLocal(ids);
  }, [ids, ready]);

  const toggle = useCallback((id: string) => {
    setIds((prev) => {
      const adding = !prev.includes(id);
      const next = adding ? [...prev, id] : prev.filter((x) => x !== id);

      // синхронизация с БД в фоне (ошибки сети не ломают UI)
      const userId = userIdRef.current;
      if (configured && userId) {
        const supabase = createClient();
        if (adding) {
          supabase
            .from("favorites")
            .upsert(
              { user_id: userId, property_id: id },
              { onConflict: "user_id,property_id", ignoreDuplicates: true },
            )
            .then(({ error }) => {
              // объект может быть demo-записью без строки в БД (invalid uuid) — игнорируем
              if (error) console.warn("[favorites]", error.message);
            });
        } else {
          supabase
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("property_id", id)
            .then(({ error }) => {
              if (error) console.warn("[favorites]", error.message);
            });
        }
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((id: string) => ids.includes(id), [ids]);

  return (
    <FavoritesContext.Provider value={{ ids, isFavorite, toggle, ready }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }
  return ctx;
}
