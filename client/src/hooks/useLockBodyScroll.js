import { useEffect } from "react";
import { isIOS } from "../utils/isIOS";

let lockCount = 0;
let savedScrollY = 0;

function lock() {
  if (lockCount === 0) {
    savedScrollY = window.scrollY;
    const s = document.body.style;
    s.position = "fixed";
    s.top = `-${savedScrollY}px`;
    s.left = "0";
    s.right = "0";
    s.width = "100%";
  }
  lockCount += 1;
}

function unlock() {
  lockCount -= 1;
  if (lockCount === 0) {
    const s = document.body.style;
    s.position = "";
    s.top = "";
    s.left = "";
    s.right = "";
    s.width = "";
    window.scrollTo(0, savedScrollY);
  }
}

export function useLockBodyScroll() {
  useEffect(() => {
    if (!isIOS) return;
    lock();
    return unlock;
  }, []);
}
