import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/db/account";
import { getMyOwnerProfile } from "@/lib/db/owner";
import OnboardingForm from "@/components/owner/OnboardingForm";

export const metadata: Metadata = {
  title: "Стать владельцем",
  robots: { index: false },
};

export const dynamic = "force-dynamic";

export default async function OwnerOnboardingPage() {
  const session = await getSessionUser();
  if (!session) redirect("/auth/login?next=/owner/onboarding");

  const owner = await getMyOwnerProfile();
  if (owner) redirect("/owner");

  return (
    <div className="container-page flex justify-center py-8">
      <div className="w-full max-w-xl">
        <h1 className="text-2xl font-extrabold text-ink sm:text-3xl">
          Станьте владельцем на IK-HOUSE
        </h1>
        <p className="mt-2 text-ink-soft">
          Добавляйте свои объекты, получайте заявки от гостей и управляйте
          бронированиями — с компьютера или прямо с телефона.
        </p>
        <div className="mt-6">
          <OnboardingForm
            defaults={{
              firstName: session.profile?.first_name ?? "",
              lastName: session.profile?.last_name ?? "",
              phone: session.profile?.phone ?? "",
            }}
          />
        </div>
      </div>
    </div>
  );
}
