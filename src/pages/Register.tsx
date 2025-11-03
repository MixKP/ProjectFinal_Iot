import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { authService } from "../services/authService";

export default function Register() {
  const navigate = useNavigate();

  async function handleRegister(username: string, password: string) {
      await authService.register(username, password);
      navigate("/dashboard");
    } 

  return (
    <AuthForm
      mode="register"
      onSubmit={handleRegister}
    />
  );
}
