import { KeyRound } from "lucide-react";
import { requireAdmin, getAdminOwners } from "@/lib/db/admin";
import AdminOwnerCard from "@/components/admin/AdminOwnerCard";

export const dynamic = "force-dynamic";

export default async function AdminOwnersPage() {
  await requireAdmin();
  const owners = await getAdminOwners();

  const pending = owners.filter((o) => o.verification_status === "pending");
  const rest = owners.filter((o) => o.verification_status !== "pending");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Владельцы</h1>
      <p className="mt-1 text-ink-muted">
        Проверка владельцев: подтверждённые получают бейдж «Проверенный
        владелец» на страницах объектов.
      </p>

      {owners.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <KeyRound className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">Владельцев пока нет</h3>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {pending.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-ink">
                Ждут проверки ({pending.length})
              </h2>
              <div className="space-y-4">
                {pending.map((o) => (
                  <AdminOwnerCard key={o.id} owner={o} />
                ))}
              </div>
            </div>
          )}
          {rest.length > 0 && (
            <div>
              <h2 className="mb-3 text-lg font-bold text-ink">Все владельцы</h2>
              <div className="space-y-4">
                {rest.map((o) => (
                  <AdminOwnerCard key={o.id} owner={o} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
