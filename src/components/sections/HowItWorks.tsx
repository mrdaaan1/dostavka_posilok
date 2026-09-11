import { FileEdit, Search, Handshake, Truck, PackageCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const steps = [
  {
    icon: FileEdit,
    title: "Заявка",
    text: "Отправитель описывает посылку и маршрут, перевозчик — свою поездку.",
  },
  {
    icon: Search,
    title: "Поиск",
    text: "Система подбирает подходящие совпадения по маршруту и датам.",
  },
  {
    icon: Handshake,
    title: "Договорённость",
    text: "Стороны списываются напрямую и подтверждают сделку.",
  },
  {
    icon: Truck,
    title: "В пути",
    text: "Посылка едет, отправитель видит статус.",
  },
  {
    icon: PackageCheck,
    title: "Готово",
    text: "Посылка доставлена, получатель подтверждает получение.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-tint py-20 sm:py-28">
      <Container>
        <Reveal>
          <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
            Как это работает
          </h2>
        </Reveal>

        <div className="relative mt-14">
          <div
            aria-hidden
            className="absolute top-7 right-0 left-0 hidden h-px bg-gradient-brand opacity-40 sm:block"
          />

          <div className="grid gap-10 sm:grid-cols-5">
            {steps.map((step, index) => (
              <Reveal key={step.title} delay={index * 0.08}>
                <div className="relative flex flex-col items-start">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-brand shadow-sm shadow-lavender/30">
                    <step.icon className="h-6 w-6 text-ink" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-semibold text-ink">{step.title}</h3>
                  <p className="mt-2 text-sm text-ink-soft">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
