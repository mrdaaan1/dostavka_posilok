import { Suspense } from "react";
import type { Metadata } from "next";
import RegisterFlow from "@/components/register/RegisterFlow";

export const metadata: Metadata = {
  title: "Регистрация — Товарище",
};

export default function RegisterPage() {
  return (
    <main className="flex flex-1 items-center justify-center px-6 py-20">
      <Suspense fallback={null}>
        <RegisterFlow />
      </Suspense>
    </main>
  );
}
