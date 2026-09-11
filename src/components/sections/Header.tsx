import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const navLinks = [
  { href: "#how-it-works", label: "Как это работает" },
  { href: "#advantages", label: "Преимущества" },
  { href: "#faq", label: "FAQ" },
];

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-surface/80 backdrop-blur">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link
            href="/"
            className="font-display text-lg font-bold tracking-tight text-gradient-brand"
          >
            Товарище
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-ink-soft transition hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/register"
              className="hidden text-sm font-medium text-ink-soft transition hover:text-ink sm:inline"
            >
              Войти
            </Link>
            <Button href="/register" className="text-xs sm:text-sm">
              Начать
            </Button>
          </div>
        </div>
      </Container>
    </header>
  );
}
