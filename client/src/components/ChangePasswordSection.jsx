import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ChangePasswordSection() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);
    try {
      await axiosInstance.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      setSuccess(
        "Password changed. Please log in again with your new password.",
      );
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(async () => {
        await logout();
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Could not change password");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6 mt-6">
      <h2 className="font-serif text-lg text-text mb-4">Change password</h2>

      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-sage/10 border border-sage/30 text-sage text-sm rounded-lg px-4 py-3 mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-muted text-xs mb-2 tracking-wide">
            Current password
          </label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                       focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          />
        </div>
        <div className="mb-5">
          <label className="block text-muted text-xs mb-2 tracking-wide">
            New password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="At least 8 characters, mixed case, number, symbol"
            className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                       placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5 hover:bg-gold/90 disabled:opacity-50"
        >
          {isSubmitting ? "Updating..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordSection;
