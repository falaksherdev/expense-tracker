export default function SummaryCard({
  label,
  value,
  valueColor = "text-text",
  sub,
  children,
}) {
  return (
    <div className="bg-surface p-5">
      <div className="text-muted text-xs mb-2 tracking-wide">{label}</div>
      <div className={`font-serif text-2xl font-semibold ${valueColor}`}>
        {value}
      </div>
      {sub && <div className="text-dim text-[11px] mt-1.5">{sub}</div>}
      {children}
    </div>
  );
}
