"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Ban, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdminUserRow } from "@/lib/db/admin";
import { cn } from "@/lib/utils";

const ROLE_LABELS: Record<string, string> = {
  guest: "Гость",
  owner: "Владелец",
  admin: "Администратор",
};

export default function AdminUserCard({
  user,
  isSelf,
}: {
  user: AdminUserRow;
  isSelf: boolean;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(user.status);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const name =
    [user.first_name, user.last_name].filter(Boolean).join(" ") || "Без имени";

  async function toggleBlock() {
    const next = status === "blocked" ? "active" : "blocked";
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ status: next })
      .eq("id", user.id);
    setBusy(false);
    if (dbErr) {
      setError("Не удалось изменить статус");
      return;
    }
    setStatus(next);
    router.refresh();
  }

  return (
    <div className="card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-bold text-ink">
            {name}
            {user.role === "admin" && (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-700">
                <ShieldCheck className="h-3.5 w-3.5" /> Админ
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-muted">
            {user.email && <span>{user.email}</span>}
            {user.phone && <span>{user.phone}</span>}
            <span>{ROLE_LABELS[user.role] ?? user.role}</span>
            <span>
              с{" "}
              {new Date(user.created_at).toLocaleDateString("ru-RU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {status === "blocked" && (
            <span className="chip bg-rose-50 text-rose-600">Заблокирован</span>
          )}
          {!isSelf && user.role !== "admin" && (
            <button
              onClick={toggleBlock}
              disabled={busy}
              className={cn(
                "btn-outline min-h-10 px-3 py-2 text-sm",
                status === "blocked"
                  ? "text-emerald-600"
                  : "border-rose-200 text-rose-600 hover:bg-rose-50",
              )}
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Ban className="h-4 w-4" />
              )}
              {status === "blocked" ? "Разблокировать" : "Заблокировать"}
            </button>
          )}
        </div>
      </div>
      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-rose-50 p-2.5 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}
    </div>
  );
}
