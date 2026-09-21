import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await axiosInstance.put(`/auth/reset-password/${token}`, { password });
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-ink flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="font-serif text-2xl sm:text-3xl text-text font-semibold">
            Set a new password
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-border rounded-2xl p-5 sm:p-8"
        >
          {error && (
            <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}

          <div className="mb-5">
            <label className="uppercase block text-muted text-xs mb-2 tracking-wide">
              New password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="At least 8 characters"
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5 hover:bg-gold/90 disabled:opacity-50"
          >
            {isSubmitting ? "Resetting..." : "Reset password"}
          </button>

          <p className="text-center text-dim text-sm mt-6">
            <Link to="/login" className="text-gold hover:underline">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
