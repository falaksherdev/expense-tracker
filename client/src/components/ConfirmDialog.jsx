export default function ConfirmDialog({
  title,
  message,
  confirmLabel = "Delete",
  onConfirm,
  onCancel,
  isLoading,
}) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-surface border border-border rounded-2xl w-full max-w-sm p-6 shadow-2xl shadow-black/40">
        <h3 className="font-serif text-lg text-text mb-2">{title}</h3>
        <p className="text-dim text-sm leading-relaxed mb-6">{message}</p>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border border-border text-text text-sm rounded-lg py-2.5
                       hover:border-gold/40 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 bg-rust text-white text-sm font-semibold rounded-lg py-2.5
                       hover:bg-rust/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
