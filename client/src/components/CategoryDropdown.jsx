import { useState, useRef, useEffect } from "react";
import DropdownPanel from "./DropdownPanel";
import { isIOS } from "../utils/isIOS";

export default function CategoryDropdown({
  options,
  value,
  onChange,
  onAddNew,
  allowAddNew = true,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const wrapperRef = useRef(null);
  const searchInputRef = useRef(null);

  const close = () => {
    setOpen(false);
    setSearch("");
  };

  // Desktop/Android par bahar click se band. iPhone par sheet ka backdrop ye kaam karta hai.
  // iPhone par ye listener isliye nahi lagate ke option tap hone se pehle hi sheet band ho jati.
  useEffect(() => {
    if (!open || isIOS) return;
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) close();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  // iPhone par auto-focus nahi, warna keyboard khul kar options dhak leta hai
  useEffect(() => {
    if (open && !isIOS) searchInputRef.current?.focus();
  }, [open]);

  const filtered = options.filter((opt) =>
    opt.toLowerCase().includes(search.toLowerCase()),
  );

  const handleSelect = (opt) => {
    onChange(opt);
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
        <span className={value ? "text-text" : "text-dim"}>
          {value || "Select a category"}
        </span>
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
        <DropdownPanel onClose={close}>
          <div className="p-2 border-b border-border shrink-0">
            <input
              ref={searchInputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search category..."
              className="w-full bg-ink border border-border rounded-md px-3 py-1.5 text-text text-sm
                         placeholder:text-dim focus:outline-none focus:border-gold/40"
            />
          </div>

          <div
            className={`overflow-y-auto overscroll-contain py-1 ${
              isIOS ? "flex-1 min-h-0" : "max-h-52"
            }`}
          >
            {filtered.length === 0 ? (
              <div className="px-4 py-3 text-dim text-sm text-center">
                No matches
              </div>
            ) : (
              filtered.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full text-left px-4 text-sm transition-colors flex items-center justify-between
                              ${isIOS ? "py-3" : "py-2"}
                              ${value === opt ? "text-gold bg-gold/5" : "text-text hover:bg-ink"}`}
                >
                  {opt}
                  {value === opt && (
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

          {allowAddNew && (
            <button
              type="button"
              onClick={() => {
                onAddNew();
                close();
              }}
              className="shrink-0 w-full text-left px-4 py-2.5 text-sm text-gold border-t border-border
                         hover:bg-gold/5 transition-colors flex items-center gap-1.5"
            >
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add custom category
            </button>
          )}
        </DropdownPanel>
      )}
    </div>
  );
}
