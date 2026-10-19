import { ArrowLeft, ArrowRight, Home, RotateCw } from "lucide-react";
import { useRef, useState } from "react";

const bookmarks = [
  { name: "Clicker", url: "/games/clicker" },
  { name: "Aim", url: "/games/aim" },
  { name: "Blocks", url: "/games/blocks" },
  { name: "Snake", url: "/games/snake" },
  { name: "Minesweeper", url: "/games/minesweeper" },
  { name: "Game of Life", url: "/games/gol" },
  { name: "Typing", url: "/games/typing" },
  { name: "Wordle", url: "/wordle" },
  { name: "RPS", url: "/rps" },
];

export function Browser() {
  const [history, setHistory] = useState<string[]>([]);
  const [index, setIndex] = useState(-1);
  const [address, setAddress] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const current = history[index];

  function go(url: string) {
    const path = url.startsWith("/") ? url : `/${url}`;
    setHistory([...history.slice(0, index + 1), path]);
    setIndex(index + 1);
    setAddress(path);
  }

  function step(delta: number) {
    const next = index + delta;
    if (next < -1 || next >= history.length) return;
    setIndex(next);
    setAddress(history[next] ?? "");
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-1 border-b border-white/5 px-2 py-1.5">
        <NavButton disabled={index < 0} onClick={() => step(-1)}>
          <ArrowLeft className="h-4 w-4" />
        </NavButton>
        <NavButton
          disabled={index >= history.length - 1}
          onClick={() => step(1)}
        >
          <ArrowRight className="h-4 w-4" />
        </NavButton>
        <NavButton onClick={() => setReloadKey((k) => k + 1)}>
          <RotateCw className="h-3.5 w-3.5" />
        </NavButton>
        <NavButton onClick={() => step(-1 - index)}>
          <Home className="h-4 w-4" />
        </NavButton>
        <form
          className="flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            if (address.trim()) go(address.trim());
            inputRef.current?.blur();
          }}
        >
          <input
            ref={inputRef}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onFocus={(e) => e.target.select()}
            placeholder="Search projects or enter a path"
            className="text-text-200 w-full rounded-md bg-black/30 px-3 py-1 text-center text-sm ring-1 ring-white/5 outline-none focus:text-left focus:ring-white/20"
          />
        </form>
      </div>
      {current ? (
        <iframe
          key={`${current}-${reloadKey}`}
          src={current}
          className="bg-background flex-1"
          title={current}
        />
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-6 p-6">
          <p className="text-text-400 text-sm tracking-[0.3em] lowercase">
            favourites
          </p>
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
            {bookmarks.map((b) => (
              <button
                key={b.url}
                onClick={() => go(b.url)}
                className="group flex flex-col items-center gap-2"
              >
                <div className="text-text-200 flex h-14 w-14 items-center justify-center rounded-md border border-white/10 text-xl font-light transition-colors group-hover:bg-white/10">
                  {b.name[0]}
                </div>
                <span className="text-text-300 text-xs">{b.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NavButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-text-300 rounded-md p-1.5 transition hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      {children}
    </button>
  );
}
