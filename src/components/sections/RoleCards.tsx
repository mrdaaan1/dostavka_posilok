"use client";

import { useState } from "react";
import { Package, Route } from "lucide-react";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

const cards = [
  {
    key: "sender",
    icon: Package,
    title: "Нужно отправить вещь в другой город",
    text: "Опишите, что и куда везти — размер, вес, даты. Найдите попутчика, который уже едет вашим маршрутом, и договоритесь напрямую.",
    cta: "Отправить посылку",
    href: "/register?role=sender",
  },
  {
    key: "carrier",
    icon: Route,
    title: "Уже собираетесь в поездку",
    text: "Укажите маршрут и сколько места у вас свободно. Возьмите чужую посылку по пути — и получите за это вознаграждение.",
    cta: "Стать перевозчиком",
    href: "/register?role=carrier",
  },
] as const;

export default function RoleCards() {
  const [active, setActive] = useState<(typeof cards)[number]["key"]>("sender");

  return (
    <section className="py-20 sm:py-28">
      <Container>
        <Reveal>
          <div className="grid overflow-hidden rounded-3xl border border-ink/10 sm:grid-cols-2">
            {cards.map((card) => {
              const isActive = active === card.key;
              return (
                <div
                  key={card.key}
                  onMouseEnter={() => setActive(card.key)}
                  className={`flex flex-col justify-between gap-8 p-10 transition-colors duration-300 sm:min-h-[22rem] ${
                    isActive ? "bg-gradient-brand" : "bg-surface-tint"
                  }`}
                >
                  <div>
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-2xl transition-colors duration-300 ${
                        isActive ? "bg-white/40" : "bg-surface"
                      }`}
                    >
                      <card.icon className="h-6 w-6 text-ink" strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-5 font-display text-2xl font-bold text-ink">
                      {card.title}
                    </h3>
                    <p className="mt-4 max-w-sm text-ink-soft">{card.text}</p>
                  </div>
                  <Button
                    href={card.href}
                    variant={isActive ? "dark" : "outline"}
                    className="self-start"
                  >
                    {card.cta}
                  </Button>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
