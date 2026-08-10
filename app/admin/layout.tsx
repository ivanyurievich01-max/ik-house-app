import type { Metadata } from "next";
import { requireAdmin } from "@/lib/db/admin";
import AdminNav from "@/components/admin/AdminNav";

export const metadata: Metadata = {
  title: "Админ-панель",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="container-page py-6 sm:py-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[240px_1fr] lg:gap-8">
        <aside>
          <AdminNav />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
