import { Wallet, Zap, ShieldCheck } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

const points = [
  {
    icon: Wallet,
    title: "Дешевле",
    text: "Вы просто благодарите человека, который и так едет вашим маршрутом — не платите за целую логистическую цепочку.",
  },
  {
    icon: Zap,
    title: "Быстрее",
    text: "Посылка доезжает за то же время, что и сам попутчик — а не после нескольких дней на складе.",
  },
  {
    icon: ShieldCheck,
    title: "Безопаснее",
    text: "Подтверждение сделки и прямая связь внутри платформы — вместо поиска через закрытые Telegram-чаты.",
  },
];

export default function PainPoint() {
  return (
    <section className="relative overflow-hidden bg-surface-tint py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl"
      />

      <Container>
        <div className="grid gap-12 sm:grid-cols-3">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.1}>
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand">
                <point.icon className="h-6 w-6 text-ink" strokeWidth={1.75} />
              </div>
              <h2 className="mt-5 font-display text-2xl font-bold text-ink sm:text-3xl">
                {point.title}
              </h2>
              <p className="mt-3 text-ink-soft">{point.text}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
