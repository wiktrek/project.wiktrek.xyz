"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Bomb, Flag } from "lucide-react";
import { cn } from "~/app/_components/lib/utils";
import {
  Choice,
  GameButton,
  GameShell,
  NewBest,
  Stat,
  Stats,
  mono,
} from "../_components/shell";
import { useBest } from "../_components/use-best";

const LEVELS = {
  easy: { rows: 9, cols: 9, mines: 10 },
  medium: { rows: 16, cols: 16, mines: 40 },
  hard: { rows: 16, cols: 30, mines: 99 },
} as const;
type Level = keyof typeof LEVELS;
type Status = "ready" | "playing" | "won" | "lost";

type Cell = {
  mine: boolean;
  adjacent: number;
  open: boolean;
  flag: boolean;
  // ms to wait before animating, so reveals ripple outward
  delay: number;
};

const NUMBER_COLORS = [
  "",
  "text-sky-300/90",
  "text-emerald-300/90",
  "text-red-300/90",
  "text-violet-300/90",
  "text-amber-300/90",
  "text-cyan-300/90",
  "text-pink-300/90",
  "text-neutral-300",
];

function emptyBoard(rows: number, cols: number): Cell[] {
  return Array.from({ length: rows * cols }, () => ({
    mine: false,
    adjacent: 0,
    open: false,
    flag: false,
    delay: 0,
  }));
}

function neighbors(i: number, rows: number, cols: number) {
  const r = Math.floor(i / cols);
  const c = i % cols;
  const out: number[] = [];
  for (let dr = -1; dr <= 1; dr++)
    for (let dc = -1; dc <= 1; dc++) {
      if (!dr && !dc) continue;
      const rr = r + dr;
      const cc = c + dc;
      if (rr >= 0 && rr < rows && cc >= 0 && cc < cols) out.push(rr * cols + cc);
    }
  return out;
}

// mines are placed after the first click, keeping it and its neighbors clear
function layMines(board: Cell[], safe: number, rows: number, cols: number, mines: number) {
  const forbidden = new Set([safe, ...neighbors(safe, rows, cols)]);
  const spots = board.map((_, i) => i).filter((i) => !forbidden.has(i));
  for (let n = 0; n < mines && spots.length; n++) {
    const pick = spots.splice(Math.floor(Math.random() * spots.length), 1)[0]!;
    board[pick]!.mine = true;
  }
  board.forEach((cell, i) => {
    cell.adjacent = neighbors(i, rows, cols).filter((n) => board[n]!.mine).length;
  });
}

export default function Page() {
  const [level, setLevel] = useState<Level>("easy");
  const { rows, cols, mines } = LEVELS[level];
  const [board, setBoard] = useState(() => emptyBoard(rows, cols));
  const [status, setStatus] = useState<Status>("ready");
  const startedAt = useRef(0);
  const [time, setTime] = useState(0);
  const [flagMode, setFlagMode] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [best, submitBest] = useBest(`minesweeper-${level}`, true);
  const longPress = useRef<{ timer: number; fired: boolean } | null>(null);

  function reset(next: Level = level) {
    const size = LEVELS[next];
    setLevel(next);
    setBoard(emptyBoard(size.rows, size.cols));
    setStatus("ready");
    setTime(0);
    setNewBest(false);
  }

  useEffect(() => {
    if (status !== "playing") return;
    const interval = setInterval(
      () => setTime(Math.floor((performance.now() - startedAt.current) / 100) / 10),
      100,
    );
    return () => clearInterval(interval);
  }, [status]);

  const flags = board.filter((c) => c.flag).length;

  function open(start: number[], cells: Cell[], origin: number) {
    const or = Math.floor(origin / cols);
    const oc = origin % cols;
    const queue = [...start];
    let hitMine = false;
    while (queue.length) {
      const i = queue.shift()!;
      const cell = cells[i]!;
      if (cell.open || cell.flag) continue;
      cell.open = true;
      const dist = Math.hypot(Math.floor(i / cols) - or, (i % cols) - oc);
      cell.delay = Math.min(dist * 25, 400);
      if (cell.mine) hitMine = true;
      else if (cell.adjacent === 0) queue.push(...neighbors(i, rows, cols));
    }
    return hitMine;
  }

  function finish(cells: Cell[], i: number, hitMine: boolean) {
    if (hitMine) {
      // reveal every mine, exploding outward from the one you hit
      const or = Math.floor(i / cols);
      const oc = i % cols;
      cells.forEach((cell, j) => {
        if (cell.mine && !cell.flag) {
          cell.open = true;
          cell.delay = Math.hypot(Math.floor(j / cols) - or, (j % cols) - oc) * 40;
        }
      });
      setStatus("lost");
      return;
    }
    if (cells.every((c) => c.mine || c.open)) {
      cells.forEach((c) => c.mine && (c.flag = true));
      setStatus("won");
      const final = Math.round((performance.now() - startedAt.current) / 100) / 10;
      setTime(final);
      setNewBest(submitBest(final));
    }
  }

  function reveal(i: number) {
    if (status === "won" || status === "lost") return;
    const cells = board.map((c) => ({ ...c }));
    const cell = cells[i]!;
    if (cell.flag) return;

    if (status === "ready") {
      layMines(cells, i, rows, cols, mines);
      setStatus("playing");
      startedAt.current = performance.now();
    }

    let targets = [i];
    if (cell.open) {
      // chord: an opened number with all its flags placed opens the rest
      const around = neighbors(i, rows, cols);
      const flagged = around.filter((n) => cells[n]!.flag).length;
      if (!cell.adjacent || flagged !== cell.adjacent) return;
      targets = around;
    }
    const hitMine = open(targets, cells, i);
    setBoard(cells);
    finish(cells, i, hitMine);
  }

  function toggleFlag(i: number) {
    if (status === "won" || status === "lost") return;
    const cell = board[i]!;
    if (cell.open) return;
    const cells = [...board];
    cells[i] = { ...cell, flag: !cell.flag, delay: 0 };
    setBoard(cells);
    navigator.vibrate?.(15);
  }

  function onPointerDown(e: React.PointerEvent, i: number) {
    if (e.pointerType !== "touch") return;
    // long press flags on touch screens
    const timer = window.setTimeout(() => {
      if (longPress.current) longPress.current.fired = true;
      toggleFlag(i);
    }, 350);
    longPress.current = { timer, fired: false };
  }

  function cancelLongPress() {
    if (longPress.current) clearTimeout(longPress.current.timer);
  }

  function onClick(i: number) {
    cancelLongPress();
    if (longPress.current?.fired) {
      longPress.current = null;
      return;
    }
    if (flagMode && !board[i]!.open) toggleFlag(i);
    else reveal(i);
  }

  const cellSize = level === "easy" ? "w-9 h-9 sm:w-10 sm:h-10" : "w-7 h-7 sm:w-8 sm:h-8";

  return (
    <GameShell
      title="Minesweeper"
      subtitle="Right-click or long-press to flag. Click a number to clear around it."
      actions={
        <Choice
          options={Object.keys(LEVELS) as Level[]}
          value={level}
          onChange={(l) => reset(l)}
        />
      }
    >
      <div className="flex w-full flex-wrap items-end justify-between gap-4">
        <Stats className="w-auto">
          <Stat label="mines left" value={mines - flags} accent />
          <Stat label="time" value={time.toFixed(1)} />
          <Stat label="best" value={best !== null ? best.toFixed(1) : "–"} />
        </Stats>
        <div className="flex items-center gap-2">
          <GameButton
            onClick={() => setFlagMode(!flagMode)}
            aria-pressed={flagMode}
            className={cn(flagMode && "border-primary text-primary")}
          >
            Flag mode {flagMode ? "on" : "off"}
          </GameButton>
          <GameButton onClick={() => reset()}>Restart</GameButton>
        </div>
      </div>

      <div className="relative max-w-full">
        <div className="max-w-full overflow-x-auto rounded-lg border border-white/10 p-2">
          <div
            className="grid w-max gap-0.5"
            style={{ gridTemplateColumns: `repeat(${cols}, auto)` }}
            onContextMenu={(e) => e.preventDefault()}
          >
            {board.map((cell, i) => (
              <button
                key={`${level}-${i}`}
                onClick={() => onClick(i)}
                onContextMenu={(e) => {
                  e.preventDefault();
                  toggleFlag(i);
                }}
                onPointerDown={(e) => onPointerDown(e, i)}
                onPointerUp={cancelLongPress}
                onPointerLeave={cancelLongPress}
                aria-label={`cell ${Math.floor(i / cols) + 1}, ${(i % cols) + 1}`}
                className={cn(
                  cellSize,
                  mono,
                  "relative flex touch-manipulation select-none items-center justify-center rounded-[3px] text-sm font-medium transition-colors sm:text-base",
                  cell.open
                    ? cell.mine
                      ? "bg-red-400/70"
                      : "bg-white/[0.02]"
                    : "bg-white/[0.09] shadow-[inset_0_-2px_0_rgba(0,0,0,0.3)] hover:bg-white/[0.14]",
                )}
              >
                {cell.open && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: cell.delay / 1000, duration: 0.15 }}
                    className={cn(
                      "absolute inset-0 flex items-center justify-center rounded-[3px]",
                      cell.mine ? "bg-red-400/80" : NUMBER_COLORS[cell.adjacent],
                    )}
                  >
                    {cell.mine ? (
                      <Bomb className="h-1/2 w-1/2 text-red-950" />
                    ) : (
                      cell.adjacent || ""
                    )}
                  </motion.span>
                )}
                {cell.flag && !cell.open && (
                  <span>
                    <Flag
                      className={cn(
                        "h-4 w-4",
                        status === "lost" && !cell.mine
                          ? "text-neutral-500 opacity-40"
                          : "fill-primary text-primary",
                      )}
                    />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <AnimatePresence>
          {(status === "won" || status === "lost") && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: status === "lost" ? 0.9 : 0.3 }}
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
            >
              <div className="pointer-events-auto flex flex-col items-center gap-3 rounded-lg border border-white/10 bg-neutral-950/95 px-8 py-6 text-center">
                {newBest && <NewBest />}
                <p className="text-xl font-semibold text-neutral-50">
                  {status === "won" ? "Cleared" : "Boom"}
                </p>
                {status === "won" && (
                  <p className={cn(mono, "text-sm tabular-nums text-neutral-400")}>
                    {time.toFixed(1)}s
                  </p>
                )}
                <GameButton variant="solid" onClick={() => reset()}>
                  Play again
                </GameButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
