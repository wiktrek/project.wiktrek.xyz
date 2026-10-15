import { createContext, useContext } from "react";
import type { Wallpaper, WindowAction, WindowState } from "../lib/os";

interface OsContext {
  windows: WindowState[];
  dispatch: (action: WindowAction) => void;
  open: (id: string) => void;
  wallpaper: Wallpaper;
  setWallpaper: (wallpaper: Wallpaper) => void;
}

export const OsContext = createContext<OsContext | null>(null);

export function useOs() {
  const ctx = useContext(OsContext);
  if (!ctx) throw new Error("useOs must be used inside <Os />");
  return ctx;
}
