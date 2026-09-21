export default function SummaryCard({
  label,
  value,
  valueColor = "text-text",
  sub,
  children,
}) {
  return (
    <div className="bg-surface p-3 sm:p-5 min-w-0">
      <div className="text-muted text-[10px] sm:text-xs mb-1.5 sm:mb-2 tracking-wide">
        {label}
      </div>
      <div
        className={`font-serif text-base sm:text-2xl font-semibold truncate ${valueColor}`}
      >
        {value}
      </div>
      {sub && (
        <div className="text-dim text-[9px] sm:text-[11px] mt-1 sm:mt-1.5 line-clamp-1">
          {sub}
        </div>
      )}
      {children}
    </div>
  );
}
