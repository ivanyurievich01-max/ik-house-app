import { Suspense } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPropertyBySlug } from "@/lib/db/properties";
import { getSessionUser } from "@/lib/db/account";
import BookingForm from "@/components/booking/BookingForm";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const p = await getPropertyBySlug(params.slug);
  return {
    title: p ? `Бронирование — ${p.title}` : "Бронирование",
    robots: { index: false },
  };
}

export default async function BookingPage({
  params,
}: {
  params: { slug: string };
}) {
  const property = await getPropertyBySlug(params.slug);
  if (!property) notFound();

  const session = await getSessionUser();
  const prefill = session
    ? {
        name: [session.profile?.first_name, session.profile?.last_name]
          .filter(Boolean)
          .join(" ")
          .trim(),
        phone: session.profile?.phone ?? "",
        email: session.user.email ?? "",
        isAuthed: true,
      }
    : null;

  return (
    <div className="container-page py-8">
      <Suspense fallback={<div className="skeleton h-96 w-full rounded-2xl" />}>
        <BookingForm property={property} prefill={prefill} />
      </Suspense>
    </div>
  );
}
