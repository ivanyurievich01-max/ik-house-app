import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/db/account";
import AccountNav from "@/components/account/AccountNav";

export const metadata: Metadata = {
  title: "Личный кабинет",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/account");

  return (
    <div className="container-page py-8">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[240px_1fr]">
        <aside>
          <AccountNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
