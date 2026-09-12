import RegisterOverlay from "@/components/register/RegisterOverlay";
import LoginFlow from "@/components/login/LoginFlow";

export default function LoginModal() {
  return (
    <RegisterOverlay>
      <LoginFlow />
    </RegisterOverlay>
  );
}
