import Container from "@/components/ui/Container";

const steps = [
  {
    number: "1",
    title: "Заявка",
    text: "Отправитель описывает посылку и маршрут, перевозчик — свою поездку.",
  },
  {
    number: "2",
    title: "Поиск",
    text: "Система подбирает подходящие совпадения по маршруту и датам.",
  },
  {
    number: "3",
    title: "Договорённость",
    text: "Стороны списываются напрямую и подтверждают сделку.",
  },
  {
    number: "4",
    title: "В пути",
    text: "Посылка едет, отправитель видит статус.",
  },
  {
    number: "5",
    title: "Готово",
    text: "Посылка доставлена, получатель подтверждает получение.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface-tint py-20 sm:py-28">
      <Container>
        <h2 className="font-display text-3xl font-bold text-ink sm:text-4xl">
          Как это работает
        </h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-5">
          {steps.map((step) => (
            <div key={step.number}>
              <div className="font-display text-3xl font-bold text-gradient-brand">
                {step.number}
              </div>
              <h3 className="mt-3 font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-sm text-ink-soft">{step.text}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
