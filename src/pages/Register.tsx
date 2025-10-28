import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  async function handleRegister(username: string, password: string) {
    try {
      setErr("");
      await authService.register(username, password);
      // register ของคุณ auto-login อยู่แล้วใน backend
      navigate("/dashboard");
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          "Could not create account."
      );
    }
  }

  return (
    <AuthForm
      mode="register"
      onSubmit={handleRegister}
      errorMessage={err}
    />
  );
}
