import { useState, useRef, useEffect } from "react";
import Calendar from "./Calendar";

const PERIODS = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
  { key: "custom", label: "Custom" },
];

export default function PeriodToggle({
  period,
  onChange,
  customRange,
  onCustomRangeChange,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [draftRange, setDraftRange] = useState(customRange);
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handlePeriodClick = (key) => {
    onChange(key);
    if (key === "custom") {
      setDraftRange(customRange);
      setShowPicker(true);
    } else {
      setShowPicker(false);
    }
  };

  const formatDisplay = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-PK", {
      day: "2-digit",
      month: "short",
    });
  };

  const hasDraftRange = draftRange.startDate && draftRange.endDate;
  const hasAppliedRange = customRange.startDate && customRange.endDate;

  const handleApply = () => {
    onCustomRangeChange(draftRange);
    setShowPicker(false);
  };

  return (
    <div className="relative flex flex-wrap items-center gap-5" ref={pickerRef}>
      {PERIODS.map((p) => (
        <button
          key={p.key}
          onClick={() => handlePeriodClick(p.key)}
          className={`text-sm pb-1.5 border-b-2 transition-colors cursor-pointer ${
            period === p.key
              ? "text-text border-gold"
              : "text-muted border-transparent hover:text-text"
          }`}
        >
          {p.label}
          {p.key === "custom" && period === "custom" && hasAppliedRange && (
            <span className="text-dim font-mono text-xs ml-1.5">
              {formatDisplay(customRange.startDate)} –{" "}
              {formatDisplay(customRange.endDate)}
            </span>
          )}
        </button>
      ))}

      {showPicker && (
        <div className="absolute top-full right-0 mt-3 z-20 bg-surface border border-border rounded-xl shadow-2xl shadow-black/40 p-4 w-80">
          <div className="text-muted text-xs tracking-wide mb-3">
            {!draftRange.startDate
              ? "Select start date"
              : !draftRange.endDate
                ? "Select end date"
                : "Date range selected"}
          </div>

          <Calendar
            startDate={draftRange.startDate}
            endDate={draftRange.endDate}
            onSelect={setDraftRange}
            mode="range"
          />

          <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
            {[
              { label: "Last 7 days", days: 7 },
              { label: "Last 30 days", days: 30 },
              { label: "Last 90 days", days: 90 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => {
                  const end = new Date();
                  const start = new Date();
                  start.setDate(end.getDate() - preset.days);
                  setDraftRange({
                    startDate: start.toISOString().split("T")[0],
                    endDate: end.toISOString().split("T")[0],
                  });
                }}
                className="text-[11px] px-2.5 py-1 rounded-full border border-border text-muted
                           hover:border-gold/40 hover:text-gold transition-colors cursor-pointer"
              >
                {preset.label}
              </button>
            ))}
          </div>

          <button
            onClick={handleApply}
            disabled={!hasDraftRange}
            className="w-full bg-gold text-ink text-sm font-semibold rounded-lg py-2
                       hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed  cursor-pointer"
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
