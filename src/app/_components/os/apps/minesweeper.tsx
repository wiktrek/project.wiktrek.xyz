import { Bomb, Flag } from "lucide-react";
import { useEffect, useState } from "react";

const SIZE = 9;
const MINES = 10;

interface Cell {
  mine: boolean;
  open: boolean;
  flag: boolean;
  count: number;
}

const neighbours = (i: number) => {
  const x = i % SIZE;
  const y = Math.floor(i / SIZE);
  const out: number[] = [];
  for (let dy = -1; dy <= 1; dy++)
    for (let dx = -1; dx <= 1; dx++) {
      const nx = x + dx;
      const ny = y + dy;
      if ((dx || dy) && nx >= 0 && ny >= 0 && nx < SIZE && ny < SIZE)
        out.push(ny * SIZE + nx);
    }
  return out;
};

const empty = (): Cell[] =>
  Array.from({ length: SIZE * SIZE }, () => ({
    mine: false,
    open: false,
    flag: false,
    count: 0,
  }));

// Mines are placed on the first click so it can never be a loss.
function plant(board: Cell[], safe: number): Cell[] {
  const cells = board.map((c) => ({ ...c }));
  const forbidden = new Set([safe, ...neighbours(safe)]);
  let placed = 0;
  while (placed < MINES) {
    const i = Math.floor(Math.random() * cells.length);
    if (forbidden.has(i) || cells[i]!.mine) continue;
    cells[i]!.mine = true;
    placed++;
  }
  cells.forEach((c, i) => {
    c.count = neighbours(i).filter((n) => cells[n]!.mine).length;
  });
  return cells;
}

const countColors = [
  "",
  "text-sky-400",
  "text-emerald-400",
  "text-rose-400",
  "text-violet-400",
  "text-amber-400",
  "text-cyan-400",
  "text-white",
  "text-text-400",
];

export function Minesweeper() {
  const [board, setBoard] = useState<Cell[]>(empty);
  const [started, setStarted] = useState(false);
  const [state, setState] = useState<"playing" | "won" | "lost">("playing");
  const [time, setTime] = useState(0);

  useEffect(() => {
    if (!started || state !== "playing") return;
    const id = setInterval(() => setTime((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [started, state]);

  function reveal(i: number) {
    if (state !== "playing") return;
    let cells = started ? board.map((c) => ({ ...c })) : plant(board, i);
    setStarted(true);
    if (cells[i]!.flag || cells[i]!.open) return;
    if (cells[i]!.mine) {
      cells = cells.map((c) => (c.mine ? { ...c, open: true } : c));
      setBoard(cells);
      setState("lost");
      return;
    }
    // Flood fill through zero-count cells.
    const stack = [i];
    while (stack.length) {
      const n = stack.pop()!;
      const cell = cells[n]!;
      if (cell.open || cell.flag) continue;
      cell.open = true;
      if (cell.count === 0) stack.push(...neighbours(n));
    }
    setBoard(cells);
    if (cells.every((c) => c.mine || c.open)) setState("won");
  }

  function flag(e: React.MouseEvent, i: number) {
    e.preventDefault();
    if (state !== "playing" || board[i]!.open) return;
    setBoard(board.map((c, j) => (j === i ? { ...c, flag: !c.flag } : c)));
  }

  function reset() {
    setBoard(empty());
    setStarted(false);
    setState("playing");
    setTime(0);
  }

  const flags = board.filter((c) => c.flag).length;

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <div className="flex w-full max-w-[300px] items-center justify-between rounded-md bg-black/30 px-3 py-2 font-mono text-sm">
        <span className="flex items-center gap-1.5">
          <Flag className="text-text-400 h-3.5 w-3.5" /> {MINES - flags}
        </span>
        <button
          onClick={reset}
          className="rounded-md bg-white/10 px-2 text-lg transition hover:bg-white/20"
        >
          {state === "won" ? "😎" : state === "lost" ? "😵" : "🙂"}
        </button>
        <span>{String(time).padStart(3, "0")}</span>
      </div>
      <div
        className="grid gap-[3px]"
        style={{ gridTemplateColumns: `repeat(${SIZE}, 1fr)` }}
      >
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => reveal(i)}
            onContextMenu={(e) => flag(e, i)}
            className={`flex h-8 w-8 items-center justify-center rounded-[5px] text-sm font-bold ${
              cell.open
                ? cell.mine
                  ? "bg-red-500/40"
                  : "bg-white/5"
                : "bg-white/15 hover:bg-white/25"
            } ${countColors[cell.count]}`}
          >
            {cell.open ? (
              cell.mine ? (
                <Bomb className="h-4 w-4" />
              ) : (
                cell.count || ""
              )
            ) : cell.flag ? (
              <Flag className="h-3.5 w-3.5 text-rose-400" />
            ) : (
              ""
            )}
          </button>
        ))}
      </div>
      <p className="text-text-500 text-xs">
        {state === "won"
          ? "You cleared the field!"
          : state === "lost"
            ? "Boom. Click the face to retry."
            : "Right-click to flag"}
      </p>
    </div>
  );
}
