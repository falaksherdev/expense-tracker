import { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import CurrencyDropdown from "./CurrencyDropdown";

const FEATURES = [
  {
    key: "committee",
    title: "Committee (kameti)",
    description: "Track rotating savings contributions",
    // Sirf in currencies ke liye dikhega — South Asia specific feature
    regions: ["PKR", "INR"],
  },
  {
    key: "lending",
    title: "Lending",
    description: "Track money you lend or borrow",
    regions: null, // null = sab currencies ke liye dikhega
  },
  {
    key: "investments",
    title: "Investments",
    description: "Mutual funds, stocks, and similar",
    regions: null,
  },
];

export default function PreferencesForm({
  initialPreferences,
  onSaved,
  submitLabel = "Save",
  showSteps = false,
}) {
  const [step, setStep] = useState(1);
  const [currency, setCurrency] = useState(
    initialPreferences?.currency || "PKR",
  );
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

  const visibleFeatures = FEATURES.filter(
    (f) => !f.regions || f.regions.includes(currency),
  );

  const handleSave = async () => {
    setIsSubmitting(true);
    setError("");
    try {
      const { data } = await axiosInstance.put("/auth/preferences", {
        ...prefs,
        currency,
      });
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not save preferences");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Agar showSteps false hai (Settings page mein), dono sections ek sath dikha do — wizard sirf Onboarding ke liye
  if (!showSteps) {
    return (
      <div>
        {error && <ErrorBox message={error} />}
        <div className="space-y-2.5 mb-6">
          <div>
            <label className="block text-muted text-xs mb-2 tracking-wide">
              Currency
            </label>
            <CurrencyDropdown value={currency} onChange={setCurrency} />
          </div>
          <IncomeExpenseStaticBox />
          {visibleFeatures.map((f) => (
            <FeatureToggle
              key={f.key}
              feature={f}
              checked={prefs[f.key]}
              onToggle={() => toggle(f.key)}
            />
          ))}
        </div>
        <SubmitButton
          onClick={handleSave}
          isSubmitting={isSubmitting}
          label={submitLabel}
        />
      </div>
    );
  }

  return (
    <div>
      {error && <ErrorBox message={error} />}

      {/* Progress indicator */}
      <div className="flex items-center gap-2 mb-6">
        <div
          className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-gold" : "bg-border"}`}
        />
        <div
          className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-gold" : "bg-border"}`}
        />
      </div>

      {step === 1 && (
        <>
          <div className="mb-6">
            <div className="text-text text-sm font-medium mb-1">
              What currency do you use?
            </div>
            <div className="text-dim text-xs mb-4">
              You can change this later in settings.
            </div>
            <CurrencyDropdown value={currency} onChange={setCurrency} />
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5 hover:bg-gold/90 transition-all  cursor-pointer"
          >
            Continue
          </button>
        </>
      )}

      {step === 2 && (
        <>
          <div className="text-text text-sm font-medium mb-1">
            What do you want to track?
          </div>
          <div className="text-dim text-xs mb-4">
            You can change this later in settings.
          </div>

          <div className="space-y-2.5 mb-6">
            <IncomeExpenseStaticBox />
            {visibleFeatures.map((f) => (
              <FeatureToggle
                key={f.key}
                feature={f}
                checked={prefs[f.key]}
                onToggle={() => toggle(f.key)}
              />
            ))}
          </div>

          <div className="flex  flex-col sm:flex-row gap-2.5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex-1 border border-border text-text text-sm rounded-lg py-2.5 hover:border-gold/40 transition-colors cursor-pointer"
            >
              Back
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSubmitting}
              className="flex-1 bg-gold text-ink font-semibold text-sm rounded-lg py-2.5
                         hover:bg-gold/90 active:scale-[0.99] transition-all
                         disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="bg-rust/10 border border-rust/30 text-rust text-sm rounded-lg px-4 py-3 mb-4">
      {message}
    </div>
  );
}

function IncomeExpenseStaticBox() {
  return (
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
        <div className="text-text text-sm font-medium">Income and expenses</div>
        <div className="text-dim text-xs">Core tracking, always on</div>
      </div>
    </div>
  );
}

function FeatureToggle({ feature, checked, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`w-full flex items-center gap-3 px-4 py-3 border rounded-lg transition-colors text-left ${
        checked
          ? "border-gold/50 bg-gold/5"
          : "border-border hover:border-border"
      }`}
    >
      <div
        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
          checked ? "bg-gold border-gold" : "border-border bg-ink"
        }`}
      >
        {checked && (
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
        <div className="text-text text-sm font-medium">{feature.title}</div>
        <div className="text-dim text-xs">{feature.description}</div>
      </div>
    </button>
  );
}

function SubmitButton({ onClick, isSubmitting, label }) {
  return (
    <button
      onClick={onClick}
      disabled={isSubmitting}
      className="w-full bg-gold text-ink font-semibold text-sm rounded-lg py-2.5
                 hover:bg-gold/90 active:scale-[0.99] transition-all
                 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
    >
      {isSubmitting ? "Saving..." : label}
    </button>
  );
}
