import { useState } from "react";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (username: string, password: string) => Promise<void>;
  errorMessage?: string;
}

export default function AuthForm({ mode, onSubmit, errorMessage }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const isLogin = mode === "login";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit(username.trim(), password.trim());
  }

  return (
    <main className="min-h-screen bg-[#f5f6fa] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex flex-col gap-5">
          {/* brand / heading */}
          <div className="flex flex-col items-center text-center gap-2">
            <div className="h-10 w-10 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-xs font-semibold shadow-sm">
              H2O
            </div>

            <div className="flex flex-col leading-tight">
              <span className="text-[11px] uppercase tracking-wide text-gray-500 font-medium">
                Smart Dispenser
              </span>

              <span className="text-lg font-semibold text-gray-900">
                {isLogin ? "Login" : "Register"}
              </span>
            </div>
          </div>

          {/* error box */}
          {errorMessage && (
            <div className="bg-red-50 text-red-600 border border-red-200 text-[12px] rounded-lg px-3 py-2 text-center">
              {errorMessage}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-700">
                Username
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[12px] font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-sm font-semibold px-4 py-2.5 shadow-sm transition-colors"
            >
              {isLogin ? "Login" : "Create account"}
            </button>
          </form>

          {/* switch link */}
          <div className="text-center text-[12px] text-gray-600">
            {isLogin ? (
              <>
                Need an account?{" "}
                <a
                  href="/register"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Register
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a
                  href="/login"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Sign in
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
