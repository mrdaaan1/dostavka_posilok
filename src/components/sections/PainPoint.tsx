import { Wallet, ShieldAlert } from "lucide-react";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";

export default function PainPoint() {
  return (
    <section className="relative overflow-hidden bg-surface-tint py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-gradient-brand opacity-20 blur-3xl"
      />

      <Container>
        <div className="grid gap-16 sm:grid-cols-2">
          <Reveal>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand">
              <Wallet className="h-6 w-6 text-ink" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
              Дёшево и быстро
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Попутчик уже едет вашим маршрутом — доставка стоит недорого и
              занимает столько же времени, сколько его поездка.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-brand">
              <ShieldAlert className="h-6 w-6 text-ink" strokeWidth={1.75} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-bold text-ink sm:text-4xl">
              Сейчас люди ищут попутчиков в Telegram-чатах
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Без проверки, без подтверждения сделки, без защиты от
              мошенников — просто отправить вещь незнакомцу и понадеяться.
              Мы делаем это безопаснее и понятнее.
            </p>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
