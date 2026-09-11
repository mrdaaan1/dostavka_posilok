"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function Hero() {
  const router = useRouter();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    router.push(`/register${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <section className="relative overflow-hidden pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="h-72 w-[42rem] bg-gradient-brand opacity-30" />
      </div>

      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl font-bold leading-tight text-ink sm:text-6xl">
            Как BlaBlaCar,
            <br />
            но для вещей
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
            Отправляйте посылки между городами вместе с теми, кто уже едет по
            вашему маршруту — быстрее и дешевле, чем через курьерскую службу.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/register?role=sender" variant="gradient">
              Отправить посылку
            </Button>
            <Button href="/register?role=carrier" variant="outline">
              Стать перевозчиком
            </Button>
          </div>

          <form
            onSubmit={handleSearch}
            className="mx-auto mt-10 flex max-w-xl flex-col gap-2 rounded-2xl border border-ink/10 bg-surface p-2 shadow-sm sm:flex-row sm:items-center"
          >
            <input
              type="text"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              placeholder="Откуда"
              className="w-full rounded-xl bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint sm:flex-1"
            />
            <span className="hidden text-ink-faint sm:block">→</span>
            <input
              type="text"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="Куда"
              className="w-full rounded-xl bg-surface-tint px-4 py-3 text-sm text-ink outline-none placeholder:text-ink-faint sm:flex-1"
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-brand px-5 py-3 text-sm font-semibold text-ink transition hover:brightness-105 sm:w-auto"
            >
              Найти
            </button>
          </form>
        </div>
      </Container>
    </section>
  );
}
