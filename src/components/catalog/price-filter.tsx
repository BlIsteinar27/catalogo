"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface PriceFilterProps {
  minPrice: number;
  maxPrice: number;
  value: [number, number] | null;
  onChange: (value: [number, number] | null) => void;
  labels?: {
    min?: string;
    max?: string;
    range?: string;
    reset?: string;
  };
}

export function PriceFilter({
  minPrice,
  maxPrice,
  value,
  onChange,
  labels = {},
}: PriceFilterProps) {
  const {
    min: minLabel = "Mín",
    max: maxLabel = "Máx",
    range: rangeLabel = "Rango de precio",
    reset: resetLabel = "Limpiar",
  } = labels;

  // Local inputs are strings — completely free-form, no clamping, no coercion
  const [localMin, setLocalMin] = useState("");
  const [localMax, setLocalMax] = useState("");

  // Sync local inputs when the external value changes (e.g. reset from parent)
  useEffect(() => {
    if (value === null) {
      setLocalMin("");
      setLocalMax("");
    } else {
      setLocalMin(String(value[0]));
      setLocalMax(String(value[1]));
    }
  }, [value]);

  const isValidNumber = (s: string): boolean => {
    if (s === "" || s === "-") return false;
    const n = Number(s);
    return !Number.isNaN(n) && Number.isFinite(n);
  };

  const tryCommitFilter = useCallback(
    (nextMin: string, nextMax: string) => {
      const minValid = isValidNumber(nextMin);
      const maxValid = isValidNumber(nextMax);

      // Filter is active ONLY when both inputs contain valid numbers
      if (minValid && maxValid) {
        onChange([Number(nextMin), Number(nextMax)]);
      } else {
        // Any empty or invalid input deactivates the filter entirely
        onChange(null);
      }
    },
    [onChange]
  );

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    // Allow empty, digits, one decimal point, and leading minus
    if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;

    setLocalMin(raw);
    tryCommitFilter(raw, localMax);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (raw !== "" && !/^-?\d*\.?\d*$/.test(raw)) return;

    setLocalMax(raw);
    tryCommitFilter(localMin, raw);
  };

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    onChange(null);
  };

  // ── Visual track ──────────────────────────────────────────────
  // The track represents the user's selected range relative to the
  // catalog's price span. Values outside the catalog range are
  // clamped visually to the bar edges — the user still sees their
  // typed values in the inputs.
  const range = maxPrice - minPrice;
  const hasRange = range > 0;

  const effectiveMin = isValidNumber(localMin) ? Number(localMin) : minPrice;
  const effectiveMax = isValidNumber(localMax) ? Number(localMax) : maxPrice;

  const clampPercent = (n: number) => Math.min(100, Math.max(0, n));

  const trackLeft = hasRange
    ? clampPercent(((effectiveMin - minPrice) / range) * 100)
    : 0;

  const trackRight = hasRange
    ? clampPercent(100 - ((effectiveMax - minPrice) / range) * 100)
    : 0;

  const isFilterActive = value !== null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-foreground">{rangeLabel}</span>
        {isFilterActive && (
          <button
            type="button"
            onClick={handleReset}
            className="text-xs px-2 py-1 rounded border border-brand/30 bg-brand/10 text-brand hover:bg-brand/20 hover:border-brand/50 transition-colors"
          >
            {resetLabel}
          </button>
        )}
      </div>

      {/* Inputs */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-2 top-0 bottom-0 flex items-center text-sm text-ink-muted pointer-events-none">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder={minLabel}
              value={localMin}
              onChange={handleMinChange}
              className="w-full rounded border border-glass-border bg-glass pl-6 pr-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
            />
          </div>
        </div>

        <span className="text-ink-muted">—</span>

        <div className="flex-1">
          <div className="relative">
            <span className="absolute left-2 top-0 bottom-0 flex items-center text-sm text-ink-muted pointer-events-none">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder={maxLabel}
              value={localMax}
              onChange={handleMaxChange}
              className="w-full rounded border border-glass-border bg-glass pl-6 pr-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-brand transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Visual track */}
      {/* <div className="relative h-1.5 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "absolute top-0 h-full rounded-full bg-primary transition-all duration-200",
            !isFilterActive && "opacity-0"
          )}
          style={{
            left: `${trackLeft}%`,
            right: `${trackRight}%`,
          }}
        />
      </div> */}

      {/* Price range hint */}
      {/* <div className="flex justify-between text-[11px] text-muted-foreground">
        <span>${minPrice.toFixed(2)}</span>
        <span>${maxPrice.toFixed(2)}</span>
      </div> */}
    </div>
  );
}