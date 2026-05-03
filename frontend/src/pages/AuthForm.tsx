import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import type { Credentials } from "../types/user.types";
import { login, register } from "../service/user.service";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "register";

export function AuthForm() {
  const { setState } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<Credentials>({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit() {
    setLoading(true);
    setError(null);
    const res = mode === "login" ? await login(form) : await register(form);
    setLoading(false);

    if (!res) {
      setError("Request failed");
      return;
    }

    localStorage.setItem("userId", res.user_id);
    setState({ isAuthenticated: true, userId: res.user_id, username: form.username });
    navigate("/");
  }

  return (
    <div className="h-full flex items-center justify-center p-6">
      <div className="w-full max-w-sm flex flex-col gap-6">

        <h2 className="text-2xl font-black tracking-widest uppercase text-center text-purple-200">
          {mode === "login" ? "Sign In" : "Sign Up"}
        </h2>

        <div className="flex flex-col gap-3">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm
                       bg-white/5 border border-purple-400/20
                       text-white placeholder-purple-300/40
                       focus:outline-none focus:border-purple-400/60 focus:bg-white/8
                       transition-all duration-200"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-xl text-sm
                       bg-white/5 border border-purple-400/20
                       text-white placeholder-purple-300/40
                       focus:outline-none focus:border-purple-400/60 focus:bg-white/8
                       transition-all duration-200"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-xl font-black text-sm tracking-widest uppercase
                       text-purple-100 transition-all duration-200
                       disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg, #2e1065 0%, #4c1d95 100%)",
              border: "1px solid #a855f766",
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : mode === "login" ? "Sign In" : "Create Account"}
          </button>

          {/* Reserve space so error never causes layout shift */}
          <div className="min-h-8 flex items-center justify-center">
            {error && (
              <p className="text-rose-400/90 text-xs text-center tracking-wide">
                {error}
              </p>
            )}
          </div>

          <button
            onClick={() => { setError(null); setMode(mode === "login" ? "register" : "login"); }}
            className="w-full text-purple-400/60 hover:text-purple-300 text-xs
                       tracking-widest uppercase transition-colors duration-200"
          >
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}