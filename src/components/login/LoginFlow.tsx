"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

export default function LoginFlow() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!isSupabaseConfigured) {
      setError("Supabase не настроен");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setIsSubmitting(false);

    if (signInError) {
      setError("Неверный email или пароль");
      return;
    }

    router.push("/app");
    router.refresh();
  }

  return (
    <>
      <Link
        href="/"
        className="font-display text-lg font-bold tracking-tight text-gradient-brand"
      >
        Товарище
      </Link>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Вход</h1>
          <p className="mt-1 text-sm text-ink-soft">
            Введите email и пароль от аккаунта
          </p>
        </div>

        <div className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Пароль"
            className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
          />
        </div>

        {error && <p className="text-sm text-pink-dark">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isSubmitting ? "Входим…" : "Войти"}
        </button>

        <p className="text-center text-sm text-ink-soft">
          Нет аккаунта?{" "}
          <Link href="/register" className="font-medium text-ink underline">
            Зарегистрироваться
          </Link>
        </p>
      </form>
    </>
  );
}
