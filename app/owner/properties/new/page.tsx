import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/db/account";
import { requireOwner } from "@/lib/db/owner";
import PropertyWizard, { emptyWizardData } from "@/components/owner/PropertyWizard";

export const dynamic = "force-dynamic";

export default async function NewPropertyPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/owner/properties/new");
  await requireOwner();

  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold text-ink">
        Добавить объект
      </h1>
      <PropertyWizard initial={emptyWizardData()} userId={session.user.id} />
    </div>
  );
}
