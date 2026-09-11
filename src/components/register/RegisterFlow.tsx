"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Package, Route, Check } from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

type Role = "sender" | "carrier";
type Step = "register" | "profile" | "done";

const roleOptions: { value: Role; icon: typeof Package; title: string; text: string }[] = [
  {
    value: "sender",
    icon: Package,
    title: "Отправитель",
    text: "Отправить или получить посылку",
  },
  {
    value: "carrier",
    icon: Route,
    title: "Перевозчик",
    text: "Еду и могу взять посылку",
  },
];

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function RegisterFlow() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");

  const [step, setStep] = useState<Step>("register");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(
    initialRole === "sender" || initialRole === "carrier" ? initialRole : null,
  );
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!role) return;
    setError(null);

    if (!isSupabaseConfigured) {
      // Supabase ещё не подключён (нет ключей в .env.local) — локальная заглушка.
      setStep("profile");
      return;
    }

    setIsSubmitting(true);
    const supabase = createClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { role } },
    });
    setIsSubmitting(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }
    setStep("profile");
  }

  async function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();

    if (isSupabaseConfigured) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ name: name || null, bio: about || null })
          .eq("id", user.id);
      }
    }

    setStep("done");
  }

  return (
    <>
      <Link
        href="/"
        className="font-display text-lg font-bold tracking-tight text-gradient-brand"
      >
        Товарище
      </Link>

      <div className="mt-8 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          {step === "register" && (
            <motion.form
              key="register"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onSubmit={handleRegister}
              className="space-y-4"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  Регистрация
                </h1>
                <p className="mt-1 text-sm text-ink-soft">
                  Email, пароль и роль — это всё, что нужно для начала
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
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </div>

              <div className="space-y-2 pt-1">
                <span className="text-xs font-medium tracking-wide text-ink-faint uppercase">
                  Кто вы?
                </span>
                <div className="grid grid-cols-2 gap-3">
                  {roleOptions.map((option) => {
                    const isSelected = role === option.value;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => setRole(option.value)}
                        aria-pressed={isSelected}
                        className={`relative flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition ${
                          isSelected
                            ? "border-transparent bg-gradient-brand"
                            : "border-ink/10 bg-surface-tint hover:border-ink/20"
                        }`}
                      >
                        {isSelected && (
                          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-surface">
                            <Check className="h-3 w-3 text-ink" strokeWidth={2.5} />
                          </span>
                        )}
                        <option.icon
                          className="h-7 w-7 text-ink"
                          strokeWidth={1.5}
                        />
                        <span className="font-medium text-ink">
                          {option.title}
                        </span>
                        <span className="text-xs text-ink-soft">
                          {option.text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {error && (
                <p className="text-sm text-pink-dark">{error}</p>
              )}

              <button
                type="submit"
                disabled={!role || isSubmitting}
                className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isSubmitting ? "Регистрируем…" : "Зарегистрироваться"}
              </button>
            </motion.form>
          )}

          {step === "profile" && (
            <motion.form
              key="profile"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              onSubmit={handleSaveProfile}
              className="space-y-4"
            >
              <div>
                <h1 className="font-display text-2xl font-bold text-ink">
                  Аккаунт создан!
                </h1>
                <p className="mt-1 text-sm text-ink-soft">
                  Расскажите о себе — необязательно, это просто поможет
                  другим вам довериться
                </p>
              </div>

              <div className="space-y-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Имя"
                  className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
                />
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="О себе (необязательно)"
                  rows={3}
                  className="w-full rounded-xl border border-ink/10 bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep("done")}
                  className="w-full rounded-xl border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface-tint"
                >
                  Пропустить
                </button>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
                >
                  Сохранить
                </button>
              </div>
            </motion.form>
          )}

          {step === "done" && (
            <motion.div
              key="done"
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="space-y-4 text-center"
            >
              <h1 className="font-display text-2xl font-bold text-ink">
                Готово!
              </h1>
              <p className="text-sm text-ink-soft">
                Регистрация прошла успешно — можно создавать первую заявку
                или поездку.
              </p>
              <Link
                href="/app"
                className="inline-flex items-center justify-center rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
              >
                В личный кабинет
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
