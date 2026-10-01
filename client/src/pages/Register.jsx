import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Logo from "../components/Logo";
import { webName } from "../constants/variables";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSlowLoading, setIsSlowLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();
  const PASSWORD_REGEX =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/;

  function getPasswordError(password) {
    if (password.length < 8) return "At least 8 characters";
    if (!/[a-z]/.test(password)) return "Add a lowercase letter";
    if (!/[A-Z]/.test(password)) return "Add an uppercase letter";
    if (!/\d/.test(password)) return "Add a number";
    if (!/[@$!%*?&#^()_\-+=]/.test(password))
      return "Add a special character (@$!%*?&...)";
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }
    const passwordError = getPasswordError(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);
    const slowTimer = setTimeout(() => setIsSlowLoading(true), 4000);

    try {
      await register(name, email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      clearTimeout(slowTimer);
      setIsSlowLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-8 relative overflow-hidden">
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-slate/5 rounded-full blur-3xl" />

      <div className="w-full max-w-md relative">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-2 text-muted text-xs sm:text-sm tracking-wide mb-2">
            <Logo size={20} className="text-gold" />
            <span>{webName}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl text-text font-semibold">
            Create your account
          </h1>
          <p className="text-dim text-xs sm:text-sm mt-2">
            Start tracking where your money goes
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
              Full name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              placeholder="Your Name"
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
                         transition-colors"
            />
          </div>

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

          <div className="mb-2">
            <label className="uppercase block text-muted text-xs mb-2 tracking-wide">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
                placeholder="At least 8 characters"
                className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 pr-11 text-text text-sm
                           placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
                           transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-dim hover:text-gold transition-colors"
              >
                {showPassword ? (
                  // Eye-off icon (password visible hai)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  // Eye icon (password hidden hai)
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <p className="text-dim text-xs mb-5 sm:mb-6">
            Minimum 8 characters ( atleast one uppercase, one lowercase, one
            number and one special character )
          </p>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5
                       hover:bg-gold/90 active:scale-[0.99] transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSlowLoading
              ? "Waking up server, please wait..."
              : isSubmitting
                ? "Creating account..."
                : "Create account"}
          </button>
          <p className="text-dim text-xs text-center mt-4">
            By creating an account you agree to our{" "}
            <Link to="/privacy" className="text-gold hover:underline">
              privacy policy
            </Link>
            .
          </p>

          <p className="text-center text-dim text-xs sm:text-sm mt-5 sm:mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-gold hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
