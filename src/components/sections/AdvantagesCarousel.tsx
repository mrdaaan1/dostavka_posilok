"use client";

import { useRef } from "react";
import { motion } from "motion/react";
import { MapPin, Sparkles, MessageCircle, Navigation, Star } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const advantages = [
  {
    icon: MapPin,
    title: "Поиск по маршруту и датам",
    text: "Указывайте города и даты — видите только те заявки и поездки, которые реально подходят.",
  },
  {
    icon: Sparkles,
    title: "ИИ-подбор попутчиков",
    text: "Система предлагает наиболее подходящие совпадения, а не просто список всех подряд.",
  },
  {
    icon: MessageCircle,
    title: "Прямая связь с попутчиком",
    text: "Пишите друг другу внутри платформы, без обмена личными контактами, пока вы сами не решите.",
  },
  {
    icon: Navigation,
    title: "Отслеживание статуса доставки",
    text: "Видно, на каком этапе посылка: принята, в пути, доставлена.",
  },
  {
    icon: Star,
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
          <Reveal>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Почему с нами удобнее
            </h2>
          </Reveal>
          <div className="hidden gap-2 sm:flex">
            <motion.button
              type="button"
              onClick={() => scrollBy(-320)}
              aria-label="Предыдущие карточки"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-surface-tint"
            >
              ←
            </motion.button>
            <motion.button
              type="button"
              onClick={() => scrollBy(320)}
              aria-label="Следующие карточки"
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-ink/15 text-ink transition-colors hover:bg-surface-tint"
            >
              →
            </motion.button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {advantages.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.06} className="shrink-0">
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="w-72 snap-start rounded-2xl border border-ink/10 bg-surface-tint p-6 shadow-sm"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-brand">
                  <item.icon className="h-5 w-5 text-ink" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-ink">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm text-ink-soft">{item.text}</p>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
