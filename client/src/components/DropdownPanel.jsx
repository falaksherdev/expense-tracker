import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { isIOS } from "../utils/isIOS";
import { useLockBodyScroll } from "../hooks/useLockBodyScroll";

function useKeyboardInset() {
  const [inset, setInset] = useState({
    bottom: 0,
    height: typeof window !== "undefined" ? window.innerHeight : 800,
  });

  useEffect(() => {
    const vv = window.visualViewport;
    if (!isIOS || !vv) return;

    const update = () => {
      setInset({
        bottom: Math.max(0, window.innerHeight - vv.height - vv.offsetTop),
        height: vv.height,
      });
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
}

export default function DropdownPanel({ onClose, children }) {
  useLockBodyScroll();
  const kb = useKeyboardInset();

  if (!isIOS) {
    return (
      <div className="absolute top-full left-0 mt-2 w-full z-30 bg-surface border border-border rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-[fadeIn_0.12s_ease-out]">
        {children}
      </div>
    );
  }

  const keyboardOpen = kb.bottom > 0;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[70] bg-black/50 touch-none cursor-pointer"
        onClick={onClose}
      />
      <div
        className="fixed inset-x-0 z-[71] mx-auto w-full max-w-md flex flex-col
                   bg-surface border-t border-border rounded-t-2xl shadow-2xl shadow-black/50
                   overflow-hidden"
        style={{
          bottom: kb.bottom,
          maxHeight: kb.height * 0.7,
          paddingBottom: keyboardOpen ? 0 : "env(safe-area-inset-bottom)",
        }}
      >
        <div className="flex justify-center pt-2.5 shrink-0">
          <span className="h-1 w-10 rounded-full bg-border" />
        </div>
        {children}
      </div>
    </>,
    document.body,
  );
}
