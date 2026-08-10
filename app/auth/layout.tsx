import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container-page flex min-h-[70vh] items-center justify-center py-10">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}
