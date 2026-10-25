"use client";
import { useCallback, useEffect, useRef, useState } from "react";

/** Persisted personal best. `lower` flips the comparison for time-based records. */
export function useBest(key: string, lower = false) {
  const storageKey = `games:best:${key}`;
  const [best, setBest] = useState<number | null>(null);
  const bestRef = useRef<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    bestRef.current = saved === null ? null : Number(saved);
    setBest(bestRef.current);
  }, [storageKey]);

  // returns true when the score is a new record
  const submit = useCallback(
    (score: number) => {
      const prev = bestRef.current;
      // a zero score isn't worth celebrating
      if (!lower && score <= 0) return false;
      if (prev !== null && (lower ? score >= prev : score <= prev))
        return false;
      bestRef.current = score;
      localStorage.setItem(storageKey, String(score));
      setBest(score);
      return true;
    },
    [storageKey, lower],
  );

  return [best, submit] as const;
}
