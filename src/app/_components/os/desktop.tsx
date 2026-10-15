import { Power, Search } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useReducer, useRef, useState } from "react";
import { focusedWindow, wallpapers, windowReducer } from "../lib/os";
import type { Wallpaper } from "../lib/os";
import { AppIcon, apps, appsById } from "./apps/apps";
import { OsContext, useOs } from "./context";
import { Window } from "./window";

const WALLPAPER_KEY = "slopos-wallpaper";
const desktopApps = ["terminal", "browser", "notes", "paint", "blog", "about"];

function useNow() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function Desktop() {
  const [windows, dispatch] = useReducer(windowReducer, []);
  const [wallpaper, setWallpaperState] = useState<Wallpaper>("graphite");

  useEffect(() => {
    const saved = localStorage.getItem(WALLPAPER_KEY);
    if (saved && saved in wallpapers) setWallpaperState(saved as Wallpaper);
  }, []);

  function setWallpaper(w: Wallpaper) {
    setWallpaperState(w);
    localStorage.setItem(WALLPAPER_KEY, w);
  }

  function open(id: string) {
    const app = appsById[id];
    if (!app) return;
    dispatch({
      type: "open",
      id,
      w: app.w,
      h: app.h,
      maximized: window.innerWidth < 640,
    });
  }

  const focused = focusedWindow(windows);

  return (
    <OsContext.Provider
      value={{ windows, dispatch, open, wallpaper, setWallpaper }}
    >
      <div
        className="text-text-100 relative h-full w-full overflow-hidden rounded-lg border border-white/10 transition-[background] duration-500 select-none"
        style={{ background: wallpapers[wallpaper] }}
      >
        {/* faint dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div className="absolute inset-x-0 top-0 bottom-10">
          <Clock />
          <DesktopIcons />
          <AnimatePresence>
            {windows.map((win) => {
              const app = appsById[win.id];
              if (!app) return null;
              return (
                <Window
                  key={win.id}
                  win={win}
                  app={app}
                  focused={focused?.id === win.id}
                />
              );
            })}
          </AnimatePresence>
        </div>
        <Taskbar focusedId={focused?.id} />
      </div>
    </OsContext.Provider>
  );
}

function Taskbar({ focusedId }: { focusedId?: string }) {
  const { windows, dispatch } = useOs();
  const [launcherOpen, setLauncherOpen] = useState(false);
  const now = useNow();

  return (
    <div className="absolute inset-x-0 bottom-0 z-[5000] flex h-10 items-center border-t border-white/10 bg-[#0e0e0e]/90 text-xs backdrop-blur">
      <button
        onClick={() => setLauncherOpen(!launcherOpen)}
        className={`flex h-full w-12 items-center justify-center font-semibold transition-colors ${
          launcherOpen ? "bg-white text-black" : "hover:bg-white/10"
        }`}
      >
        w
      </button>
      <div className="flex h-full min-w-0 flex-1 overflow-x-auto">
        {windows.map((win) => {
          const app = appsById[win.id];
          if (!app) return null;
          const active = win.id === focusedId;
          return (
            <button
              key={win.id}
              onClick={() =>
                dispatch(
                  active
                    ? { type: "minimize", id: win.id }
                    : { type: "focus", id: win.id },
                )
              }
              className={`relative flex h-full shrink-0 items-center px-4 lowercase transition-colors hover:bg-white/5 ${
                active ? "text-white" : "text-text-500"
              }`}
            >
              {app.name}
              {active && (
                <span className="absolute inset-x-4 bottom-0 h-px bg-white" />
              )}
            </button>
          );
        })}
      </div>
      <div className="text-text-400 px-4 font-mono tabular-nums">
        {now?.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
        })}
        <span className="text-text-700 mx-2">/</span>
        {now?.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
      <AnimatePresence>
        {launcherOpen && <Launcher onClose={() => setLauncherOpen(false)} />}
      </AnimatePresence>
    </div>
  );
}

function Launcher({ onClose }: { onClose: () => void }) {
  const { open, dispatch } = useOs();
  const [query, setQuery] = useState("");
  const results = apps.filter((a) =>
    a.name.toLowerCase().includes(query.toLowerCase()),
  );

  function launch(id: string) {
    open(id);
    onClose();
  }

  return (
    <>
      <div className="fixed inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 6 }}
        transition={{ duration: 0.12 }}
        className="absolute bottom-11 left-1 w-64 rounded-md border border-white/10 bg-[#161616] text-sm shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]"
      >
        <div className="flex items-center gap-2 border-b border-white/[0.06] px-3">
          <Search className="text-text-600 h-3.5 w-3.5" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && results[0]) launch(results[0].id);
              if (e.key === "Escape") onClose();
            }}
            placeholder="search apps"
            className="placeholder:text-text-600 h-9 flex-1 bg-transparent outline-none"
          />
        </div>
        <ul className="max-h-80 overflow-y-auto p-1">
          {results.map((app) => {
            const Icon = app.icon;
            return (
              <li key={app.id}>
                <button
                  onClick={() => launch(app.id)}
                  className="text-text-300 flex w-full items-center gap-3 rounded px-2 py-1.5 lowercase hover:bg-white/10 hover:text-white"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.5} />
                  {app.name}
                </button>
              </li>
            );
          })}
          {results.length === 0 && (
            <li className="text-text-600 px-2 py-1.5">no results</li>
          )}
        </ul>
        <div className="flex justify-end border-t border-white/[0.06] p-1">
          <button
            onClick={() => {
              dispatch({ type: "closeAll" });
              onClose();
            }}
            title="Close all windows"
            className="text-text-500 rounded p-1.5 hover:bg-white/10 hover:text-white"
          >
            <Power className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.div>
    </>
  );
}

function DesktopIcons() {
  const { open } = useOs();
  const [selected, setSelected] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  // Deselect when clicking anywhere else.
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setSelected(null);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, []);

  return (
    <div ref={ref} className="absolute top-4 left-4 flex flex-col gap-1">
      {desktopApps.map((id) => {
        const app = appsById[id]!;
        return (
          <button
            key={id}
            onClick={() => setSelected(id)}
            onDoubleClick={() => open(id)}
            className={`flex w-20 flex-col items-center gap-1.5 rounded py-2 transition-colors ${
              selected === id ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <AppIcon app={app} className="h-10 w-10" />
            <span className="text-text-300 text-[11px] lowercase">
              {app.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function Clock() {
  const now = useNow();
  if (!now) return null;
  return (
    <div className="pointer-events-none absolute inset-0 hidden flex-col items-center justify-center text-white/[0.12] md:flex">
      <div className="text-[9rem] leading-none font-thin tracking-tighter tabular-nums">
        {now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        })}
      </div>
      <div className="mt-2 text-sm tracking-[0.3em] lowercase">
        {now.toLocaleDateString(undefined, {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
      </div>
    </div>
  );
}
