export interface WindowState {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  z: number;
  minimized: boolean;
  maximized: boolean;
}

export type WindowAction =
  | {
      type: "open";
      id: string;
      w: number;
      h: number;
      maximized?: boolean;
    }
  | { type: "close"; id: string }
  | { type: "closeAll" }
  | { type: "focus"; id: string }
  | { type: "minimize"; id: string }
  | { type: "toggleMaximize"; id: string }
  | { type: "move"; id: string; x: number; y: number }
  | { type: "resize"; id: string; w: number; h: number };

const topZ = (windows: WindowState[]) =>
  windows.reduce((max, w) => Math.max(max, w.z), 0);

function update(
  windows: WindowState[],
  id: string,
  fn: (w: WindowState) => Partial<WindowState>,
) {
  return windows.map((w) => (w.id === id ? { ...w, ...fn(w) } : w));
}

export function windowReducer(
  windows: WindowState[],
  action: WindowAction,
): WindowState[] {
  switch (action.type) {
    case "open": {
      const z = topZ(windows) + 1;
      if (windows.some((w) => w.id === action.id)) {
        return update(windows, action.id, () => ({ z, minimized: false }));
      }
      const offset = (windows.length % 6) * 28;
      return [
        ...windows,
        {
          id: action.id,
          x: 320 + offset,
          y: 30 + offset,
          w: action.w,
          h: action.h,
          z,
          minimized: false,
          maximized: action.maximized ?? false,
        },
      ];
    }
    case "close":
      return windows.filter((w) => w.id !== action.id);
    case "closeAll":
      return [];
    case "focus": {
      const z = topZ(windows) + 1;
      return update(windows, action.id, (w) =>
        w.z === z - 1 ? {} : { z, minimized: false },
      );
    }
    case "minimize":
      return update(windows, action.id, () => ({ minimized: true }));
    case "toggleMaximize":
      return update(windows, action.id, (w) => ({ maximized: !w.maximized }));
    case "move":
      return update(windows, action.id, () => ({ x: action.x, y: action.y }));
    case "resize":
      return update(windows, action.id, () => ({ w: action.w, h: action.h }));
  }
}

/** The focused window is the visible one with the highest z-index. */
export function focusedWindow(windows: WindowState[]) {
  return windows
    .filter((w) => !w.minimized)
    .reduce<WindowState | undefined>(
      (top, w) => (!top || w.z > top.z ? w : top),
      undefined,
    );
}

export const wallpapers = {
  graphite: "#121212",
  ink: "#0f1218",
  moss: "#121611",
  clay: "#171210",
  stone: "#1c1c1b",
} as const;

export type Wallpaper = keyof typeof wallpapers;
