"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";

type Role = "sender" | "carrier";
type Step = "register" | "profile" | "done";

const roleOptions: { value: Role; title: string; text: string }[] = [
  {
    value: "sender",
    title: "Отправитель / получатель",
    text: "Хочу отправить или получить посылку",
  },
  {
    value: "carrier",
    title: "Перевозчик",
    text: "Еду по маршруту и могу взять посылку с собой",
  },
];

const stepVariants = {
  enter: { opacity: 0, x: 24 },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -24 },
};

export default function RegisterFlow() {
  const router = useRouter();
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

  function handleClose() {
    router.back();
  }

  function handleBackdropClick(event: React.MouseEvent) {
    if (event.target === event.currentTarget) handleClose();
  }

  function handleRegister(event: React.FormEvent) {
    event.preventDefault();
    if (!role) return;
    // TODO: когда появится ключ Supabase — заменить на supabase.auth.signUp
    // и запись роли в таблицу профилей. Дальше — переход к анкете.
    setStep("profile");
  }

  function handleSaveProfile(event: React.FormEvent) {
    event.preventDefault();
    setStep("done");
  }

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-10"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="relative w-full max-w-md rounded-3xl bg-surface p-8 shadow-2xl shadow-black/30"
      >
        <button
          type="button"
          onClick={handleClose}
          aria-label="Закрыть"
          className="absolute top-5 right-5 flex h-9 w-9 items-center justify-center rounded-full text-ink-faint transition hover:bg-surface-tint hover:text-ink"
        >
          <X className="h-4 w-4" strokeWidth={1.75} />
        </button>

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
                  <span className="text-xs font-medium text-ink-faint uppercase tracking-wide">
                    Кто вы?
                  </span>
                  {roleOptions.map((option) => (
                    <label
                      key={option.value}
                      className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${
                        role === option.value
                          ? "border-lavender-dark bg-surface-tint"
                          : "border-ink/10"
                      }`}
                    >
                      <input
                        type="radio"
                        name="role"
                        value={option.value}
                        checked={role === option.value}
                        onChange={() => setRole(option.value)}
                        className="mt-1"
                      />
                      <span>
                        <span className="block font-medium text-ink">
                          {option.title}
                        </span>
                        <span className="block text-sm text-ink-soft">
                          {option.text}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  disabled={!role}
                  className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Зарегистрироваться
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
                  Регистрация прошла успешно. Личный кабинет появится на
                  следующем этапе — часть функций пока в разработке.
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center rounded-xl border border-ink/15 px-5 py-3 text-sm font-semibold text-ink transition hover:bg-surface-tint"
                >
                  На главную
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
