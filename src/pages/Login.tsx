import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();
  const [err, setErr] = useState("");

  async function handleLogin(username: string, password: string) {
    try {
      setErr("");
      await authService.login(username, password);
      navigate("/dashboard");
    } catch (e: any) {
      setErr(
        e?.response?.data?.message ||
          "Username or password is incorrect."
      );
    }
  }

  return (
    <AuthForm mode="login" onSubmit={handleLogin} errorMessage={err} />
  );
}
