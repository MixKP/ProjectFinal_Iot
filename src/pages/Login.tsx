import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/authService";

export default function Login() {
  const navigate = useNavigate();

  async function handleLogin(username: string, password: string) {
      await authService.login(username, password);
      navigate("/dashboard");
    }

  return (
    <AuthForm mode="login" onSubmit={handleLogin} />
  );
}
