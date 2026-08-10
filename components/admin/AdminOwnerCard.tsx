"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
  X,
  Loader2,
  AlertCircle,
  Phone,
  Home,
  Ban,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { AdminOwnerRow } from "@/lib/db/admin";
import { cn } from "@/lib/utils";

const VERIFICATION_LABELS: Record<string, string> = {
  unverified: "Не проверен",
  pending: "Ждёт проверки",
  verified: "Проверен",
  rejected: "Отклонён",
};

const VERIFICATION_STYLES: Record<string, string> = {
  unverified: "bg-slate-100 text-ink-soft",
  pending: "bg-amber-50 text-amber-700",
  verified: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-600",
};

const OWNER_TYPE_LABELS: Record<string, string> = {
  individual: "Частное лицо",
  entrepreneur: "ИП",
  company: "Компания",
};

export default function AdminOwnerCard({ owner }: { owner: AdminOwnerRow }) {
  const router = useRouter();
  const [verification, setVerification] = useState(owner.verification_status);
  const [userStatus, setUserStatus] = useState(owner.user?.status ?? "active");
  const [busy, setBusy] = useState<null | string>(null);
  const [error, setError] = useState("");

  const propertiesCount = owner.properties?.[0]?.count ?? 0;

  async function setVerificationStatus(status: "verified" | "rejected") {
    setBusy(status);
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const { error: dbErr } = await supabase
      .from("owner_profiles")
      .update({
        verification_status: status,
        reviewed_at: new Date().toISOString(),
        reviewed_by: user?.id ?? null,
      })
      .eq("id", owner.id);
    setBusy(null);
    if (dbErr) {
      setError("Не удалось обновить статус");
      return;
    }
    setVerification(status);
    router.refresh();
  }

  async function toggleBlockUser() {
    if (!owner.user) return;
    const next = userStatus === "blocked" ? "active" : "blocked";
    setBusy("block");
    setError("");
    const supabase = createClient();
    const { error: dbErr } = await supabase
      .from("profiles")
      .update({ status: next })
      .eq("id", owner.user.id);
    setBusy(null);
    if (dbErr) {
      setError("Не удалось изменить статус пользователя");
      return;
    }
    setUserStatus(next);
    router.refresh();
  }

  return (
    <div className="card p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-bold text-ink">{owner.display_name}</div>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-muted">
            <span>{OWNER_TYPE_LABELS[owner.owner_type] ?? owner.owner_type}</span>
            {owner.user?.email && <span>{owner.user.email}</span>}
            {owner.public_phone && (
              <span className="inline-flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> {owner.public_phone}
              </span>
            )}
            <span className="inline-flex items-center gap-1">
              <Home className="h-3.5 w-3.5" /> объектов: {propertiesCount}
            </span>
          </div>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className={cn("chip", VERIFICATION_STYLES[verification])}>
            {VERIFICATION_LABELS[verification] ?? verification}
          </span>
          {userStatus === "blocked" && (
            <span className="chip bg-rose-50 text-rose-600">Заблокирован</span>
          )}
        </div>
      </div>

      {owner.about && (
        <p className="mt-2 rounded-xl bg-slate-50 p-3 text-sm text-ink-soft">
          {owner.about}
        </p>
      )}

      {error && (
        <div className="mt-2 flex items-start gap-2 rounded-xl bg-rose-50 p-2.5 text-sm text-rose-600">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        {verification !== "verified" && (
          <button
            onClick={() => setVerificationStatus("verified")}
            disabled={busy !== null}
            className="btn-primary min-h-11 px-4 py-2 text-sm"
          >
            {busy === "verified" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <BadgeCheck className="h-4 w-4" />
            )}
            Подтвердить
          </button>
        )}
        {verification !== "rejected" && (
          <button
            onClick={() => setVerificationStatus("rejected")}
            disabled={busy !== null}
            className="btn-outline min-h-11 border-rose-200 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
          >
            {busy === "rejected" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <X className="h-4 w-4" />
            )}
            Отклонить
          </button>
        )}
        <button
          onClick={toggleBlockUser}
          disabled={busy !== null || !owner.user}
          className={cn(
            "btn-outline min-h-11 px-3 py-2 text-sm",
            userStatus === "blocked"
              ? "text-emerald-600"
              : "border-rose-200 text-rose-600 hover:bg-rose-50",
          )}
        >
          {busy === "block" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Ban className="h-4 w-4" />
          )}
          {userStatus === "blocked" ? "Разблокировать" : "Заблокировать"}
        </button>
      </div>
    </div>
  );
}
