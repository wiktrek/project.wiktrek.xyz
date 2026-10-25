import { Check } from "lucide-react";
import { wallpapers } from "../../lib/os";
import type { Wallpaper } from "../../lib/os";
import { useOs } from "../context";

export function Settings() {
  const { wallpaper, setWallpaper, dispatch } = useOs();

  return (
    <div className="space-y-6 p-5">
      <section>
        <h2 className="text-text-400 mb-3 text-sm font-semibold tracking-wider uppercase">
          Wallpaper
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(wallpapers) as Wallpaper[]).map((name) => (
            <button
              key={name}
              onClick={() => setWallpaper(name)}
              className="group text-left"
            >
              <div
                style={{ background: wallpapers[name] }}
                className={`relative aspect-video rounded-md ring-2 transition ${
                  wallpaper === name
                    ? "ring-white"
                    : "ring-white/10 group-hover:ring-white/40"
                }`}
              >
                {wallpaper === name && (
                  <Check className="absolute top-1.5 right-1.5 h-4 w-4 rounded-full bg-white p-0.5 text-black" />
                )}
              </div>
              <span className="text-text-300 mt-1 block text-xs capitalize">
                {name}
              </span>
            </button>
          ))}
        </div>
      </section>
      <section>
        <h2 className="text-text-400 mb-3 text-sm font-semibold tracking-wider uppercase">
          Windows
        </h2>
        <button
          onClick={() => dispatch({ type: "closeAll" })}
          className="rounded-md bg-white/10 px-4 py-2 text-sm transition hover:bg-white/20"
        >
          Close all windows
        </button>
      </section>
    </div>
  );
}
