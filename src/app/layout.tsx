import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, Unbounded } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  weight: ["500", "700", "800"],
});

const siteUrl = "https://tovarische.example";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Товарище — доставка посылок с попутчиками",
  description:
    "Как BlaBlaCar, но для вещей. Отправляйте посылки между городами вместе с теми, кто уже едет по вашему маршруту — быстрее и дешевле, чем через курьерскую службу.",
  openGraph: {
    title: "Товарище — доставка посылок с попутчиками",
    description:
      "Как BlaBlaCar, но для вещей. Найдите попутчика для доставки посылки между городами.",
    url: siteUrl,
    siteName: "Товарище",
    locale: "ru_RU",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Товарище — доставка посылок с попутчиками",
    description:
      "Как BlaBlaCar, но для вещей. Найдите попутчика для доставки посылки между городами.",
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: ReactNode;
  modal: ReactNode;
}) {
  return (
    <html
      lang="ru"
      className={`${inter.variable} ${unbounded.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {children}
        {modal}
      </body>
    </html>
  );
}
