import { useState } from "react";
import { useAuth } from "../context/AuthProvider";
import type { Credentials } from "../types/user.types";
import { login,register } from "../service/user.service";
import { useNavigate } from "react-router-dom";

type Mode = "login" | "register";


// AuthForm.tsx
export function AuthForm() {
  const { setState } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [form, setForm] = useState<Credentials>({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
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
    setState({
      isAuthenticated: true,
      userId: res.user_id,
      username: form.username,
    });
    navigate("/");
  }

  return (
    <div className="min-h-screen flex justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-light text-white tracking-tight">
            {mode === "login" ? "Sign in" : "Sign up"}
          </h2>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-purple-400/20 
                     text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400/60 
                     focus:bg-white/10 transition-all duration-200"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 rounded-lg bg-white/5 border border-purple-400/20 
                     text-white placeholder-purple-300/40 focus:outline-none focus:border-purple-400/60 
                     focus:bg-white/10 transition-all duration-200"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-purple-500/80 backdrop-blur-sm
                     text-white font-medium hover:bg-purple-500 
                     transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                     border border-purple-400/30"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Loading...
              </span>
            ) : mode === "login" ? (
              "Sign in"
            ) : (
              "Create account"
            )}
          </button>

          {error && (
            <p className="text-rose-400/90 text-sm text-center bg-rose-500/10 py-2 rounded-lg">
              {error}
            </p>
          )}

          <button
            onClick={() => setMode(mode === "login" ? "register" : "login")}
            className="w-full text-purple-300/70 hover:text-purple-300 text-sm transition-colors duration-200"
          >
            {mode === "login"
              ? "Don't have an account?"
              : "Already have an account?"}
          </button>
        </div>
      </div>
    </div>
  );
}