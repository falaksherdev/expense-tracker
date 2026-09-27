import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../api/axiosInstance";

export default function VerifyEmailBanner() {
  const { user } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (!user || user.isVerified || dismissed) return null;

  const handleResend = async () => {
    setIsSending(true);
    try {
      await axiosInstance.post("/auth/resend-verification");
      setSent(true);
    } catch (err) {
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="bg-gold/10 border border-gold/30 rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-3 flex-wrap">
      <div className="flex items-center gap-2 text-sm text-text">
        <span className="text-gold">✉️</span>
        {sent ? (
          <span>Verification email sent — check your inbox.</span>
        ) : (
          <span>Please verify your email address.</span>
        )}
      </div>
      <div className="flex items-center gap-3">
        {!sent && (
          <button
            onClick={handleResend}
            disabled={isSending}
            className="text-gold text-xs font-medium hover:underline disabled:opacity-50 cursor-pointer"
          >
            {isSending ? "Sending..." : "Resend email"}
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-dim text-xs hover:text-text"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
