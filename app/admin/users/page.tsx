import { Users } from "lucide-react";
import { requireAdmin, getAdminUsers } from "@/lib/db/admin";
import AdminUserCard from "@/components/admin/AdminUserCard";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const session = await requireAdmin();
  const users = await getAdminUsers();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Пользователи</h1>
      <p className="mt-1 text-ink-muted">
        Все зарегистрированные пользователи платформы ({users.length}).
      </p>

      {users.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-slate-100">
            <Users className="h-7 w-7 text-ink-muted" />
          </div>
          <h3 className="mt-3 font-bold text-ink">Пользователей пока нет</h3>
        </div>
      ) : (
        <div className="mt-5 space-y-3">
          {users.map((u) => (
            <AdminUserCard
              key={u.id}
              user={u}
              isSelf={u.id === session.user.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
