import { redirect } from "next/navigation";
import Link from "next/link";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";

export default async function AppLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, name")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "sender";

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-ink/5 bg-surface/80 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-6">
          <Link
            href="/app"
            className="font-display text-lg font-bold tracking-tight text-gradient-brand"
          >
            Товарище
          </Link>

          <nav className="flex items-center gap-6 text-sm font-medium text-ink-soft">
            {role === "sender" ? (
              <>
                <Link href="/app/requests/new" className="hover:text-ink">
                  Создать заявку
                </Link>
                <Link href="/app/trips" className="hover:text-ink">
                  Найти поездку
                </Link>
              </>
            ) : (
              <>
                <Link href="/app/trips/new" className="hover:text-ink">
                  Создать поездку
                </Link>
                <Link href="/app/requests" className="hover:text-ink">
                  Найти заявку
                </Link>
              </>
            )}
            <Link href="/app" className="hover:text-ink">
              Моё
            </Link>
          </nav>

          <span className="text-sm text-ink-faint">
            {profile?.name || user.email}
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10">
        {children}
      </main>
    </>
  );
}
