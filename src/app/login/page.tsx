import type { Metadata } from "next";
import RegisterOverlay from "@/components/register/RegisterOverlay";
import LoginFlow from "@/components/login/LoginFlow";

export const metadata: Metadata = {
  title: "Вход — Товарище",
};

export default function LoginPage() {
  return (
    <RegisterOverlay standalone>
      <LoginFlow />
    </RegisterOverlay>
  );
}
