import Container from "@/components/ui/Container";

export default function PainPoint() {
  return (
    <section className="bg-surface-tint py-20 sm:py-28">
      <Container>
        <div className="grid gap-16 sm:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Дёшево и быстро
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Попутчик уже едет вашим маршрутом — доставка стоит недорого и
              занимает столько же времени, сколько его поездка.
            </p>
          </div>

          <div>
            <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
              Сейчас люди ищут попутчиков в Telegram-чатах
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Без проверки, без подтверждения сделки, без защиты от
              мошенников — просто отправить вещь незнакомцу и понадеяться.
              Мы делаем это безопаснее и понятнее.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
