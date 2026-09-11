import Link from "next/link";
import Container from "@/components/ui/Container";

const columns = [
  {
    title: "Товарище",
    links: [
      { href: "#how-it-works", label: "Как это работает" },
      { href: "#faq", label: "FAQ" },
      { href: "mailto:monochromeworld42@gmail.com", label: "Контакты" },
    ],
  },
  {
    title: "Документы",
    links: [
      { href: "/privacy", label: "Политика конфиденциальности" },
      { href: "/terms", label: "Условия использования" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-ink/10 py-16">
      <Container>
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <span className="font-display text-lg font-bold text-gradient-brand">
              Товарище
            </span>
            <p className="mt-3 text-sm text-ink-soft">
              Как BlaBlaCar, но для вещей. Доставка посылок между городами с
              помощью попутчиков.
            </p>
            <a
              href="https://t.me/ElfishMarshmallow"
              className="mt-4 inline-block text-sm font-medium text-ink-soft transition hover:text-ink"
            >
              Telegram
            </a>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:flex sm:gap-16">
            {columns.map((column) => (
              <div key={column.title}>
                <h4 className="text-sm font-semibold text-ink">
                  {column.title}
                </h4>
                <ul className="mt-4 space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-soft transition hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <p className="mt-12 text-xs text-ink-faint">
          © {new Date().getFullYear()} Товарище. Все права защищены.
        </p>
      </Container>
    </footer>
  );
}
