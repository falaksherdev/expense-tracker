import { useState, useRef, useEffect } from "react";
import Calendar from "./Calendar";

const PERIODS = [
  { key: "weekly", label: "Weekly" },
  { key: "monthly", label: "Monthly" },
  { key: "yearly", label: "Yearly" },
  { key: "custom", label: "Custom" },
];

const POPUP_WIDTH = 320; // w-80

export default function PeriodToggle({
  period,
  onChange,
  customRange,
  onCustomRangeChange,
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [draftRange, setDraftRange] = useState(customRange);
  const [alignLeft, setAlignLeft] = useState(false);
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

  // Popup kholne se pehle: right se kholne par left kinara screen se bahar
  // jaye to left se kholo, warna right se
  const decideAlign = () => {
    if (!pickerRef.current) return;
    const rect = pickerRef.current.getBoundingClientRect();
    setAlignLeft(rect.right - POPUP_WIDTH < 12);
  };

  const handlePeriodClick = (key) => {
    onChange(key);
    if (key === "custom") {
      setDraftRange(customRange);
      decideAlign();
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
          type="button"
          onClick={() => handlePeriodClick(p.key)}
          className={`text-sm pb-1.5 border-b-2 transition-colors ${
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
          {/* Sirf 428px tak: peeche ka dark backdrop */}
          <div
            className="min-[429px]:hidden fixed inset-0 z-[60] bg-black/50 touch-none"
            onClick={() => setShowPicker(false)}
          />

          <div
            className={`bg-surface border-border p-4
              max-[428px]:fixed max-[428px]:inset-x-0 max-[428px]:bottom-0 max-[428px]:z-[61]
              max-[428px]:mx-auto max-[428px]:w-full max-[428px]:max-w-sm
              max-[428px]:rounded-t-2xl max-[428px]:border-t
              max-[428px]:pb-[calc(1rem+env(safe-area-inset-bottom))]
              max-[428px]:shadow-2xl max-[428px]:shadow-black/50
              min-[429px]:absolute min-[429px]:top-full min-[429px]:mt-3 min-[429px]:z-20
              min-[429px]:w-80 min-[429px]:rounded-xl min-[429px]:border
              min-[429px]:shadow-2xl min-[429px]:shadow-black/40
              ${alignLeft ? "min-[429px]:left-0" : "min-[429px]:right-0"}`}
          >
            <div className="min-[429px]:hidden flex justify-center mb-3">
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
