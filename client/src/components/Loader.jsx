export default function Loader({
  label = "Loading",
  fullScreen = true,
  size = "md",
}) {
  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const content = (
    <div className="flex flex-col items-center gap-5">
      <div className={`relative ${sizeClasses[size]}`}>
        <div className="absolute inset-0 rounded-full border-2 border-border" />
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-gold animate-spin" />
      </div>

      {label && (
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-sm text-muted tracking-wide">
            {label}
          </span>
          <span className="flex gap-1">
            <span className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:-0.3s]" />
            <span className="w-1 h-1 rounded-full bg-gold animate-bounce [animation-delay:-0.15s]" />
            <span className="w-1 h-1 rounded-full bg-gold animate-bounce" />
          </span>
        </div>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center">
        {content}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-6">{content}</div>;
}
