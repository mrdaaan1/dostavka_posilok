import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import Reveal from "@/components/ui/Reveal";

export default function FinalCta() {
  return (
    <section className="py-8">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-dark px-8 py-16 text-center sm:px-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-20"
            >
              <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-mint blur-3xl" />
              <div className="absolute -bottom-24 -right-10 h-64 w-64 rounded-full bg-pink blur-3xl" />
            </div>

            <h2 className="relative font-display text-3xl font-bold text-white sm:text-4xl">
              Найди своего попутчика уже сегодня
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-white/70">
              Зарегистрируйтесь и опубликуйте первую заявку — это займёт пару
              минут.
            </p>
            <div className="relative mt-8">
              <Button href="/register" variant="gradient">
                Зарегистрироваться
              </Button>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
