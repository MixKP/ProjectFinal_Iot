import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLogin = mode === "login";
  const title = isLogin ? "Login" : "Register";
  const buttonText = isLogin ? "Sign In" : "Create Account";
  const redirectText = isLogin
    ? "No account? Register"
    : "Already have account? Login";
  const redirectPath = isLogin ? "/register" : "/login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      if (isLogin) {
        await authService.login(username, password);
      } else {
        await authService.register(username, password);
      }
      navigate("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-200 p-4">
      <div className="w-full max-w-sm bg-white rounded-lg shadow p-6">
        <h1 className="text-xl font-bold text-center mb-4">{title}</h1>

        {error && (
          <div className="bg-red-100 text-red-700 text-sm p-2 rounded mb-3">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/40"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="mt-1 w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            className="w-full bg-black text-white rounded py-2 text-sm font-semibold hover:bg-black/80"
            type="submit"
          >
            {buttonText}
          </button>
        </form>

        <div className="text-center text-xs text-gray-600 mt-4">
          <Link
            to={redirectPath}
            className="underline hover:text-black font-medium"
          >
            {redirectText}
          </Link>
        </div>
      </div>
    </main>
  );
}
