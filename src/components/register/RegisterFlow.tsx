"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

type Role = "sender" | "carrier";
type Step = 1 | 2 | 3 | "done";

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

export default function RegisterFlow() {
  const searchParams = useSearchParams();
  const initialRole = searchParams.get("role");

  const [step, setStep] = useState<Step>(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role | null>(
    initialRole === "sender" || initialRole === "carrier" ? initialRole : null,
  );
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");

  function handleStep1(event: React.FormEvent) {
    event.preventDefault();
    setStep(2);
  }

  function handleStep2() {
    if (!role) return;
    setStep(3);
  }

  function handleFinish(event: React.FormEvent) {
    event.preventDefault();
    // TODO: когда появится ключ Supabase — заменить на supabase.auth.signUp
    // и запись роли/анкеты в таблицу профилей.
    setStep("done");
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <Link
        href="/"
        className="font-display text-lg font-bold tracking-tight text-gradient-brand"
      >
        Товарище
      </Link>

      <div className="mt-10">
        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                Регистрация
              </h1>
              <p className="mt-1 text-sm text-ink-soft">Шаг 1 из 3 — вход</p>
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

            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105"
            >
              Далее
            </button>
          </form>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                Кто вы?
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Шаг 2 из 3 — выберите одну роль
              </p>
            </div>

            <div className="space-y-3">
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
              type="button"
              onClick={handleStep2}
              disabled={!role}
              className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Далее
            </button>
          </div>
        )}

        {step === 3 && (
          <form onSubmit={handleFinish} className="space-y-4">
            <div>
              <h1 className="font-display text-2xl font-bold text-ink">
                Расскажите о себе
              </h1>
              <p className="mt-1 text-sm text-ink-soft">
                Шаг 3 из 3 — необязательно, можно пропустить
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
                Готово
              </button>
            </div>
          </form>
        )}

        {step === "done" && (
          <div className="space-y-4 text-center">
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
          </div>
        )}
      </div>
    </div>
  );
}
