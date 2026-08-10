import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/db/account";
import { getMyOwnerProfile } from "@/lib/db/owner";
import OwnerNav from "@/components/owner/OwnerNav";

export const metadata: Metadata = {
  title: "Панель владельца",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/owner");

  const owner = await getMyOwnerProfile();

  // Без owner-профиля рендерим без сайдбара (страница онбординга).
  // Каждая внутренняя страница панели сама проверяет наличие профиля
  // через requireOwner() и переадресует на онбординг.
  if (!owner) {
    return <>{children}</>;
  }

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside>
          <OwnerNav
            verificationStatus={owner.verification_status}
            displayName={owner.display_name}
          />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
