import { useAuth } from "../context/AuthContext";
import { getCurrencySymbol } from "../constants/currencies";

export function useCurrency() {
  const { user } = useAuth();
  const symbol = getCurrencySymbol(user?.preferences?.currency);

  const fmt = (n) => new Intl.NumberFormat().format(Math.abs(n || 0));

  const fmtWithSymbol = (n) => {
    const num = n || 0;
    const sign = num < 0 ? "−" : "";
    return `${sign}${symbol} ${fmt(num)}`;
  };

  return { symbol, fmt, fmtWithSymbol };
}
