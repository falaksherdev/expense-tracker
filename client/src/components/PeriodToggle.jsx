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
          className={`text-sm pb-1.5 border-b-2 transition-colors cursor-pointer
            ${
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
        <>
          {/* Mobile backdrop: bahar tap karne se band, touch-none se peeche ka page nahi hilta */}
          <div
            className="md:hidden fixed inset-0 z-[60] bg-black/50 touch-none"
            onClick={() => setShowPicker(false)}
          />

          {/* Mobile: neeche chipki sheet. Desktop: pehle jaisa dropdown popup */}
          <div
            className="fixed left-0 right-0 bottom-0 z-[61] mx-auto w-full max-w-sm
                 rounded-t-2xl border-t border-border bg-surface p-4
                 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl shadow-black/50
                 md:absolute md:left-auto md:right-0 md:bottom-auto md:top-full md:mt-3 md:mx-0
                 md:z-20 md:w-80 md:max-w-none md:rounded-xl md:border md:pb-4 md:shadow-black/40"
          >
            <div className="md:hidden flex justify-center mb-3">
              <span className="h-1 w-10 rounded-full bg-border" />
            </div>

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
                  type="button"
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
                       hover:border-gold/40 hover:text-gold transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleApply}
              disabled={!hasDraftRange}
              className="w-full bg-gold text-ink text-sm font-semibold rounded-lg py-2
                   hover:bg-gold/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Apply
            </button>
          </div>
        </>
      )}
    </div>
  );
}
