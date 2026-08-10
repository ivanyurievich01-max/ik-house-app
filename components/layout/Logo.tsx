import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  className,
  withTagline = true,
}: {
  className?: string;
  withTagline?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn("flex items-center gap-2.5", className)}
      aria-label="IK-HOUSE — на главную"
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-lake-600 shadow-soft">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-white" fill="none">
          <path
            d="M4 11.5 12 5l8 6.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6 10.5V18h12v-7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M4 19c1.4-.9 2.6-.9 4 0s2.6.9 4 0 2.6-.9 4 0 2.6.9 4 0"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="text-lg font-extrabold tracking-tight text-ink">
          IK<span className="text-brand-500">-</span>HOUSE
        </span>
        {withTagline && (
          <span className="mt-0.5 hidden text-[11px] font-medium text-ink-muted sm:block">
            Иссык-Куль — отдых как ты хочешь
          </span>
        )}
      </span>
    </Link>
  );
}
