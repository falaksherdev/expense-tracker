import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const FEATURES = [
  {
    key: "committee",
    title: "Committee (kameti)",
    description: "Track rotating savings contributions",
  },
  {
    key: "lending",
    title: "Lending",
    description: "Track money you lend or borrow",
  },
  {
    key: "investments",
    title: "Investments",
    description: "Mutual funds, stocks, and similar",
  },
];

export default function PreferencesForm({
  initialPreferences,
  onSaved,
  submitLabel = "Save",
}) {
  const [prefs, setPrefs] = useState({
    committee: initialPreferences?.committee || false,
    lending: initialPreferences?.lending || false,
    investments: initialPreferences?.investments || false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const toggle = (key) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const { data } = await axiosInstance.put("/auth/preferences", prefs);
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save preferences");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      <div className="space-y-2.5 mb-6">
        {/* Income/Expense — always on, shown for context but disabled */}
        <div className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg bg-ink/40">
          <div className="w-5 h-5 rounded-md bg-gold flex items-center justify-center shrink-0">
            <svg
              className="w-3.5 h-3.5 text-ink"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-text text-sm font-medium">
              Income and expenses
            </div>
            <div className="text-dim text-xs">Core tracking, always on</div>
          </div>
        </div>

        {FEATURES.map((f) => (
          <button
            key={f.key}
            type="button"
            onClick={() => toggle(f.key)}
            className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg transition-colors text-left ${
              prefs[f.key]
                ? "border-gold/50 bg-gold/5"
                : "border-border hover:border-border"
            }`}
          >
            <div
              className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                prefs[f.key] ? "bg-gold border-gold" : "border-border bg-ink"
              }`}
            >
              {prefs[f.key] && (
                <svg
                  className="w-3.5 h-3.5 text-ink"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="text-text text-sm font-medium">{f.title}</div>
              <div className="text-dim text-xs">{f.description}</div>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={isSubmitting}
        className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5
                   hover:bg-gold/90 active:scale-[0.99] transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving..." : submitLabel}
      </button>
    </div>
  );
}
