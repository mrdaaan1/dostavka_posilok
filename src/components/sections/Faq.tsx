"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const faqItems = [
  {
    question: "Что можно отправлять через сервис?",
    answer:
      "Личные вещи и посылки, без запрещённых к перевозке предметов: оружия, наркотических и психотропных веществ, взрывоопасных и легковоспламеняющихся предметов, а также всего, что запрещено к пересылке законодательством РФ. Ответственность за содержимое посылки несёт отправитель.",
  },
  {
    question: "Кто отвечает за сохранность посылки?",
    answer:
      "Сервис помогает найти попутчика и организовать связь между сторонами, но не является курьерской или логистической компанией. Условия передачи и ответственность за груз согласовываются напрямую между отправителем и перевозчиком.",
  },
  {
    question: "Как происходит подбор попутчика?",
    answer:
      "Вы публикуете заявку с маршрутом и датами — система показывает подходящие совпадения среди перевозчиков и отправителей, которые едут или хотят отправить посылку по тому же направлению.",
  },
  {
    question: "Безопасно ли это?",
    answer:
      "Прямая переписка внутри платформы, подтверждение сделки обеими сторонами и отслеживание статуса доставки делают процесс прозрачнее, чем поиск попутчиков в закрытых чатах. Как и в любой сделке между людьми, важно проявлять разумную осторожность.",
  },
  {
    question: "Нужно ли подтверждать почту при регистрации?",
    answer:
      "Нет — сейчас регистрация упрощена: email и пароль, без подтверждения почты.",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-surface-tint py-20 sm:py-28">
      <Container>
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Частые вопросы
          </h2>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-10 divide-y divide-ink/10 border-y border-ink/10">
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="font-medium text-ink">
                      {item.question}
                    </span>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-xl text-ink-faint"
                    >
                      +
                    </motion.span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 text-sm text-ink-soft">
                          {item.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
