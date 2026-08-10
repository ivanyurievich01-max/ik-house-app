import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/db/account";
import ProfileForm from "@/components/account/ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/account/profile");

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink">Мой профиль</h1>
      <p className="mt-1 text-ink-muted">
        Личные данные и настройки аккаунта.
      </p>
      <div className="mt-6 max-w-xl">
        <ProfileForm
          initial={{
            firstName: session.profile?.first_name ?? "",
            lastName: session.profile?.last_name ?? "",
            phone: session.profile?.phone ?? "",
            avatarUrl: session.profile?.avatar_url ?? null,
            email: session.user.email ?? "",
            emailVerified: !!session.user.email_confirmed_at,
            phoneVerified: session.profile?.phone_verified ?? false,
          }}
        />
      </div>
    </div>
  );
}
