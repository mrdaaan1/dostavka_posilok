import type { Metadata } from "next";
import Container from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "Политика конфиденциальности — Товарище",
};

export default function PrivacyPage() {
  return (
    <main className="flex-1 py-20">
      <Container>
        <div className="mx-auto max-w-2xl space-y-6">
          <h1 className="font-display text-3xl font-bold text-ink">
            Политика конфиденциальности
          </h1>
          <p className="text-sm text-ink-faint">
            Черновая версия для этапа тестирования сервиса. Будет
            доработана с юристом перед коммерческим запуском.
          </p>

          <div className="space-y-4 text-ink-soft">
            <p>
              Сервис «Товарище» собирает email и пароль при регистрации, а
              также данные, которые вы сами указываете в анкете и заявках
              (имя, маршрут, описание посылки).
            </p>
            <p>
              Эти данные используются только для работы сервиса: поиска
              совпадений между отправителями и перевозчиками, связи между
              сторонами и отображения статуса заявок. Данные не передаются
              третьим лицам, кроме случаев, предусмотренных законодательством
              РФ.
            </p>
            <p>
              Вы можете запросить удаление своих данных, написав на{" "}
              <a
                href="mailto:monochromeworld42@gmail.com"
                className="text-ink underline"
              >
                monochromeworld42@gmail.com
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </main>
  );
}
