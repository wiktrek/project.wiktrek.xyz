"use client";
import { useEffect, useState } from "react";

/** Shows a saved personal best on the games index, if there is one. */
export function BestLabel({
  storageKey,
  unit,
}: {
  storageKey: string;
  unit?: string;
}) {
  const [best, setBest] = useState<string | null>(null);
  useEffect(() => {
    setBest(localStorage.getItem(`games:best:${storageKey}`));
  }, [storageKey]);
  if (best === null || !(Number(best) > 0)) return null;
  return (
    <>
      best {best}
      {unit}
    </>
  );
}
