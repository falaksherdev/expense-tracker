import { useState } from "react";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

function toISO(date) {
  return date.toISOString().split("T")[0];
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getStartOffset(year, month) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function Calendar({
  startDate,
  endDate,
  onSelect,
  mode = "range",
}) {
  const today = new Date();
  const [viewYear, setViewYear] = useState(
    startDate ? new Date(startDate).getFullYear() : today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    startDate ? new Date(startDate).getMonth() : today.getMonth(),
  );

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const startOffset = getStartOffset(viewYear, viewMonth);
  const todayISO = toISO(today);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const handleDayClick = (day) => {
    const clicked = toISO(new Date(viewYear, viewMonth, day));
    if (clicked > todayISO) return; // future dates disabled

    if (!startDate || (startDate && endDate)) {
      // Naya range shuru karo
      onSelect({ startDate: clicked, endDate: "" });
    } else if (clicked < startDate) {
      // Agar user pehle wali date se pehle ki date chune, swap kar do
      onSelect({ startDate: clicked, endDate: startDate });
    } else {
      onSelect({ startDate, endDate: clicked });
    }
  };

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goPrevMonth}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-gold hover:bg-ink transition-colors"
        >
          ‹
        </button>
        <div className="text-text text-sm font-medium">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </div>
        <button
          type="button"
          onClick={goNextMonth}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted hover:text-gold hover:bg-ink transition-colors"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {DAY_LABELS.map((d, i) => (
          <div key={i} className="text-center text-dim text-[10px] py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />;

          const iso = toISO(new Date(viewYear, viewMonth, day));
          const isFuture = iso > todayISO;
          const isToday = iso === todayISO;
          const isStart = iso === startDate;
          const isEnd = iso === endDate;
          const inRange =
            startDate && endDate && iso > startDate && iso < endDate;
          const isSingleDayCompleteRange =
            startDate && endDate && startDate === endDate;
          const applyFlatRight =
            mode === "range" && Boolean(startDate) && !isSingleDayCompleteRange;
          const applyFlatLeft =
            mode === "range" && Boolean(endDate) && startDate !== endDate;
          return (
            <button
              type="button"
              key={day}
              disabled={isFuture}
              onClick={() => handleDayClick(day)}
              className={`
                relative h-8 text-xs rounded-md transition-colors
                ${isFuture ? "text-dim/40 cursor-not-allowed" : "text-text hover:bg-border cursor-pointer"}
                ${inRange ? "bg-gold/10 text-gold rounded-none" : ""}
                ${isStart || isEnd ? "bg-gold text-ink font-semibold hover:bg-gold" : ""}
        ${isStart && applyFlatRight ? "rounded-r-none" : ""}
      ${isEnd && applyFlatLeft ? "rounded-l-none" : ""}
              `}
            >
              {day}
              {isToday && !isStart && !isEnd && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-gold" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
