import { useState, useRef, useEffect } from "react";
import { CURRENCIES } from "../constants/currencies";
import DropdownPanel from "./DropdownPanel";
import { isIOS } from "../utils/isIOS";

export default function CurrencyDropdown({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  useEffect(() => {
    if (!open || isIOS) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (open && !isIOS) searchInputRef.current?.focus();
  }, [open]);

  const selected = CURRENCIES.find((c) => c.code === value);

  const filtered = CURRENCIES.filter(
    (c) =>
      c.label.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (code) => {
    onChange(code);
    close();
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
          <span className="flex items-center gap-2.5 text-text min-w-0">
            <span className="w-6 text-center text-gold font-mono shrink-0">
              {selected.symbol}
            </span>
            <span className="truncate">{selected.label}</span>
            <span className="text-dim text-xs shrink-0">({selected.code})</span>
          </span>
        ) : (
          <span className="text-dim">Select a currency</span>
        )}
        <svg
          className={`w-4 h-4 text-muted transition-transform shrink-0 ${open ? "rotate-180" : ""}`}
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
        <DropdownPanel onClose={close}>
          <div className="p-2 border-b border-border shrink-0">
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

          <div
            className={`overflow-y-auto overscroll-contain py-1 ${
              isIOS ? "flex-1 min-h-0" : "max-h-60"
            }`}
          >
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
                  className={`w-full text-left px-4 text-sm transition-colors flex items-center justify-between
                              ${isIOS ? "py-3" : "py-2.5"}
                              ${value === c.code ? "text-gold bg-gold/5" : "text-text hover:bg-ink"}`}
                >
                  <span className="flex items-center gap-2.5 min-w-0">
                    <span className="w-6 text-center font-mono shrink-0">
                      {c.symbol}
                    </span>
                    <span className="truncate">{c.label}</span>
                    <span className="text-dim text-xs shrink-0">
                      ({c.code})
                    </span>
                  </span>
                  {value === c.code && (
                    <svg
                      className="w-4 h-4 shrink-0"
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
        </DropdownPanel>
      )}
    </div>
  );
}
