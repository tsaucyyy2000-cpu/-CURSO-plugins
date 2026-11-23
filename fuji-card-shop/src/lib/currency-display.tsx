"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Catalog amounts stay USD. GBP is offered as a display preference only when a
 * verified FX rate exists — we do not invent conversion rates.
 */
export type DisplayCurrency = "USD" | "GBP";

type CurrencyContextValue = {
  display: DisplayCurrency;
  setDisplay: (next: DisplayCurrency) => void;
  /** True only when GBP conversion is authorized with a verified rate. */
  gbpConversionAvailable: boolean;
  note: string;
};

const STORAGE_KEY = "fuji-card-shop-display-currency-v1";
const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyDisplayProvider({ children }: { children: ReactNode }) {
  const [display, setDisplayState] = useState<DisplayCurrency>("USD");
  const gbpConversionAvailable = false;

  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(() => {
      if (cancelled) {
        return;
      }
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (raw === "USD" || raw === "GBP") {
          setDisplayState(raw);
        }
      } catch {
        // keep USD
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const setDisplay = useCallback((next: DisplayCurrency) => {
    setDisplayState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore persistence failures
    }
  }, []);

  const note = useMemo(() => {
    if (display === "GBP" && !gbpConversionAvailable) {
      return "GBP display selected, but no verified FX rate is configured. Catalog prices stay USD — inquire on WhatsApp for a GBP quote.";
    }
    return "Catalog prices are USD from the Fuji Japan sealed list.";
  }, [display, gbpConversionAvailable]);

  const value = useMemo(
    () => ({ display, setDisplay, gbpConversionAvailable, note }),
    [display, setDisplay, gbpConversionAvailable, note],
  );

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrencyDisplay(): CurrencyContextValue {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrencyDisplay must be used within CurrencyDisplayProvider");
  }
  return context;
}

export function CurrencyToggle() {
  const { display, setDisplay, note } = useCurrencyDisplay();
  return (
    <div className="currency-toggle" role="group" aria-label="Display currency">
      <label className="currency-toggle-label">
        <span className="visually-hidden">Display currency</span>
        <select
          value={display}
          onChange={(event) => {
            const value = event.target.value;
            if (value === "USD" || value === "GBP") {
              setDisplay(value);
            }
          }}
          aria-describedby="currency-toggle-note"
        >
          <option value="USD">USD · catalog</option>
          <option value="GBP">GBP · quote only</option>
        </select>
      </label>
      <p id="currency-toggle-note" className="currency-toggle-note">
        {note}
      </p>
    </div>
  );
}
