import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

export default function FeedbackModal({ onClose }) {
  useLockBodyScroll();
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await axiosInstance.post("/feedback", { message });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Could not send feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6">
        {sent ? (
          <>
            <h3 className="font-serif text-lg text-text mb-2">Thank you! 🙏</h3>
            <p className="text-dim text-sm mb-5">
              Your feedback helps make this app better.
            </p>
            <button
              onClick={onClose}
              className="w-full bg-gold text-ink text-sm font-semibold rounded-lg py-2.5 hover:bg-gold/90 transition-colors"
            >
              Close
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <h3 className="font-serif text-lg text-text mb-2">
              Share your feedback
            </h3>
            <p className="text-dim text-sm mb-4">
              Found a bug? Have a suggestion? Let me know.
            </p>

            {error && (
              <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-2.5 mb-3">
                {error}
              </div>
            )}

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              required
              placeholder="Type your feedback here..."
              maxLength={1000}
              className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm mb-1
                         placeholder:text-dim focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 resize-none"
            />
            <div className="text-dim text-xs text-right mb-4">
              {message.length}/1000
            </div>

            <div className="flex gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 border border-border text-text text-sm rounded-lg py-2.5 hover:border-gold/40 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gold text-ink text-sm font-semibold rounded-lg py-2.5
                           hover:bg-gold/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? "Sending..." : "Send"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
