import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/AuthContext";

export default function DeleteAccountSection() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [error, setError] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleDelete = async () => {
    setError("");
    setIsDeleting(true);
    try {
      await axiosInstance.delete("/auth/account");
      setUser(null);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Could not delete account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-surface border border-rust/30 rounded-2xl p-5 sm:p-6">
      <h2 className="font-serif text-lg text-rust mb-2">Delete account</h2>
      <p className="text-dim text-sm mb-4">
        This permanently deletes your account and all your data — transactions,
        categories, everything. This cannot be undone.
      </p>

      {!showConfirm ? (
        <button
          type="button"
          onClick={() => setShowConfirm(true)}
          className="text-rust text-sm font-medium border border-rust/40 rounded-lg px-4 py-2 hover:bg-rust/10 transition-colors  cursor-pointer"
        >
          Delete my account
        </button>
      ) : (
        <div>
          {error && (
            <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-4">
              {error}
            </div>
          )}
          <label className="block text-muted text-xs mb-2 tracking-wide">
            Type <span className="text-text font-mono">DELETE</span> to confirm
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            className="w-full bg-ink border border-border rounded-lg px-4 py-2.5 text-text text-sm
                       focus:outline-none focus:border-rust/50 focus:ring-1 focus:ring-rust/30 mb-4"
          />
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => {
                setShowConfirm(false);
                setConfirmText("");
                setError("");
              }}
              className="flex-1 border border-border text-text text-sm rounded-lg py-2.5 hover:border-gold/40 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={confirmText !== "DELETE" || isDeleting}
              className="flex-1 bg-rust text-white text-sm font-semibold rounded-lg py-2.5
                         hover:bg-rust/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              {isDeleting ? "Deleting..." : "Permanently delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
