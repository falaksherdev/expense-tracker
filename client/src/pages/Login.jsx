import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { webName } from "../constants/variables";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Subtle background accent glow */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-slate/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 text-muted text-xs sm:text-sm tracking-wide mb-2">
            <Logo size={20} className="text-gold" />
            <span>{webName}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-text font-semibold">
            Welcome back
          </h1>
          <p className="text-dim text-xs sm:text-sm mt-2">
            Log in to see where your money went
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-5 sm:p-8 shadow-2xl shadow-black/20"
        >
          {error && (
            <div className="bg-rust/10 border border-rust/30 text-rust text-xs sm:text-sm rounded-lg px-4 py-3 mb-4 sm:mb-5">
              {error}
            </div>
          )}

          <div className="mb-4 sm:mb-5">
            <label className="uppercase block text-muted text-xs mb-2 tracking-wide">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
                         transition-colors"
            />
          </div>

          <div className="mb-5 sm:mb-6">
            <label className="uppercase block text-muted text-xs mb-2 tracking-wide">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
                         transition-colors"
            />
          </div>
          <div className="flex justify-end mt-2 mb-6">
            <Link
              to="/forgot-password"
              className="text-gold text-xs hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5
                       hover:bg-gold/90 active:scale-[0.99] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Logging in..." : "Log in"}
          </button>

          <p className="text-center text-dim text-xs sm:text-sm mt-5 sm:mt-6">
            Don't have an account?{" "}
            <Link to="/register" className="text-gold hover:underline">
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
