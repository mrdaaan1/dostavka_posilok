import { Suspense } from "react";
import RegisterOverlay from "@/components/register/RegisterOverlay";
import RegisterFlow from "@/components/register/RegisterFlow";

export default function RegisterModal() {
  return (
    <RegisterOverlay>
      <Suspense fallback={null}>
        <RegisterFlow />
      </Suspense>
    </RegisterOverlay>
  );
}
