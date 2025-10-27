import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";

type AuthMode = "login" | "register";

interface AuthFormProps {
  mode: AuthMode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const isLogin = mode === "login";
  const title = isLogin ? "Login" : "Register";
  const buttonText = isLogin ? "Sign In" : "Create Account";
  const redirectText = isLogin
    ? "No account? Register"
    : "Already have an account? Login";
  const redirectLink = isLogin ? "/register" : "/login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      if (isLogin) {
        const res = await authService.login(username, password);
        if (res.success) {
          localStorage.setItem("user", username);
          navigate("/dashboard");
        } else {
          setError("Invalid username or password");
        }
      } else {
        const res = await authService.register(username, password);
        if (res.success) {
          navigate("/login");
        } else {
          setError(res.message || "Registration failed");
        }
      }
    } catch {
      setError("Username or password wrong!");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen w-screen bg-gradient-to-br from-blue-50 to-blue-200">
      <div className="bg-white w-full max-w-sm mx-4 rounded-2xl shadow-lg p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
          {title}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm py-2.5 rounded-lg shadow-sm active:scale-[0.98] transition"
          >
            {buttonText}
          </button>

          {error && (
            <p className="text-red-500 text-sm text-center mt-2">{error}</p>
          )}
        </form>

        <p className="text-sm text-gray-500 text-center mt-6">
          {redirectText.split("?")[0]}{" "}
          <Link
            to={redirectLink}
            className="text-blue-600 hover:underline font-medium"
          >
            {redirectText.split(" ")[redirectText.split(" ").length - 1]}
          </Link>
        </p>
      </div>
    </div>
  );
}
