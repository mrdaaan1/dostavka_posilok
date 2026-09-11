import Link from "next/link";
import type { ReactNode } from "react";

type Variant = "gradient" | "outline" | "dark";

const variantClasses: Record<Variant, string> = {
  gradient:
    "bg-gradient-brand text-ink shadow-sm shadow-lavender/30 hover:brightness-105 hover:shadow-md hover:shadow-lavender/40",
  outline:
    "border border-ink/15 text-ink hover:border-ink/30 hover:bg-surface-tint",
  dark: "bg-surface text-dark hover:bg-surface-tint",
};

export default function Button({
  href,
  children,
  variant = "gradient",
  className = "",
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-semibold transition ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Link>
  );
}
