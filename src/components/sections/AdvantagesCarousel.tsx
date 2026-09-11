"use client";

import { useRef } from "react";
import Container from "@/components/ui/Container";

const advantages = [
  {
    title: "Поиск по маршруту и датам",
    text: "Указывайте города и даты — видите только те заявки и поездки, которые реально подходят.",
  },
  {
    title: "ИИ-подбор попутчиков",
    text: "Система предлагает наиболее подходящие совпадения, а не просто список всех подряд.",
  },
  {
    title: "Прямая связь с попутчиком",
    text: "Пишите друг другу внутри платформы, без обмена личными контактами, пока вы сами не решите.",
  },
  {
    title: "Отслеживание статуса доставки",
    text: "Видно, на каком этапе посылка: принята, в пути, доставлена.",
  },
  {
    title: "Рейтинги и отзывы",
    text: "Оценивайте друг друга после сделки — рейтинг помогает выбирать надёжных попутчиков.",
  },
];

export default function AdvantagesCarousel() {
  const scrollerRef = useRef<HTMLDivElement>(null);

  function scrollBy(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: "smooth" });
  }

  return (
    <section id="advantages" className="py-20 sm:py-28">
      <Container>
        <div className="flex items-end justify-between">
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Почему с нами удобнее
          </h2>
          <div className="hidden gap-2 sm:flex">
            <button
              type="button"
              onClick={() => scrollBy(-320)}
              aria-label="Предыдущие карточки"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-tint"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => scrollBy(320)}
              aria-label="Следующие карточки"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:bg-surface-tint"
            >
              →
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {advantages.map((item) => (
            <div
              key={item.title}
              className="w-72 shrink-0 snap-start rounded-2xl border border-ink/10 bg-surface-tint p-6"
            >
              <h3 className="font-display text-lg font-bold text-ink">
                {item.title}
              </h3>
              <p className="mt-3 text-sm text-ink-soft">{item.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
