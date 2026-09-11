"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import type { Currency } from "@/lib/supabase/types";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);
const STORAGE_KEY = "catalogo-currency";

function readStoredCurrency(): Currency {
  if (typeof window === "undefined") return "USD";
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "USD" || stored === "EUR") return stored;
  } catch {}
  return "USD";
}

// TEMPORARILY DISABLED: Single currency (USD) mode
// export function CurrencyProvider({ children }: { children: React.ReactNode }) {
//   const [currency, setCurrencyState] = useState<Currency>(() => readStoredCurrency());

//   const setCurrency = useCallback((currency: Currency) => {
//     setCurrencyState(currency);
//   }, []);

//   useEffect(() => {
//     try {
//       window.localStorage.setItem(STORAGE_KEY, currency);
//     } catch {}
//   }, [currency]);

//   useEffect(() => {
//     const handleStorage = (e: StorageEvent) => {
//       if (e.key !== STORAGE_KEY) return;
//       const value = e.newValue;
//       if (value === "USD" || value === "EUR") setCurrencyState(value);
//     };
//     window.addEventListener("storage", handleStorage);
//     return () => window.removeEventListener("storage", handleStorage);
//   }, []);

//   const value = useMemo(
//     () => ({ currency, setCurrency }),
//     [currency, setCurrency],
//   );

//   return (
//     <CurrencyContext.Provider value={value}>
//       {children}
//     </CurrencyContext.Provider>
//   );
// }

// TEMPORARILY DISABLED: Single currency (USD) mode
// export function useCurrency() {
//   const ctx = useContext(CurrencyContext);
//   if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
//   return ctx;
// }
