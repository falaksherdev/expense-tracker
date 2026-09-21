import { useState, useRef, useEffect } from "react";
import { CURRENCIES } from "../constants/currencies";

export default function CurrencyDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) searchInputRef.current?.focus();
  }, [open]);

  const selected = CURRENCIES.find((c) => c.code === value);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (code) => {
    onChange(code);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between bg-ink border rounded-lg px-4 py-2.5 text-sm
                    transition-colors ${
                      open
                        ? "border-gold/50 ring-1 ring-gold/30"
                        : "border-border"
                    }`}
      >
        {selected ? (
          <span className="flex items-center gap-2.5 text-text">
            <span className="w-6 text-center text-gold font-mono">
              {selected.symbol}
            </span>
            <span>{selected.label}</span>
            <span className="text-dim text-xs">({selected.code})</span>
          </span>
        ) : (
          <span className="text-dim">Select a currency</span>
        )}
        <svg
          className={`w-4 h-4 text-muted transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-full z-30 bg-surface border border-border rounded-xl
                         shadow-2xl shadow-black/40 overflow-hidden animate-[fadeIn_0.12s_ease-out]"
        >
          <div className="p-2 border-b border-border">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search currency..."
              className="w-full bg-ink border border-border rounded-md px-3 py-1.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/40"
            />
          </div>

          <div className="max-h-60 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-dim text-sm text-center">
                No matches
              </div>
            ) : (
              filtered.map((c) => (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => handleSelect(c.code)}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between
                              ${value === c.code ? "text-gold bg-gold/5" : "text-text hover:bg-ink"}`}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-6 text-center font-mono">
                      {c.symbol}
                    </span>
                    <span>{c.label}</span>
                    <span className="text-dim text-xs">({c.code})</span>
                  </span>
                  {value === c.code && (
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
