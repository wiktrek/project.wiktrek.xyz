"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "~/app/_components/lib/utils";
import { GameButton, GameShell, Stat, Stats, mono } from "../_components/shell";

const COLS = 64;
const ROWS = 40;

// patterns as [row, col] offsets
const PRESETS: Record<string, [number, number][]> = {
  "glider gun": [
    [4, 0],
    [4, 1],
    [5, 0],
    [5, 1],
    [4, 10],
    [5, 10],
    [6, 10],
    [3, 11],
    [7, 11],
    [2, 12],
    [8, 12],
    [2, 13],
    [8, 13],
    [5, 14],
    [3, 15],
    [7, 15],
    [4, 16],
    [5, 16],
    [6, 16],
    [5, 17],
    [2, 20],
    [3, 20],
    [4, 20],
    [2, 21],
    [3, 21],
    [4, 21],
    [1, 22],
    [5, 22],
    [0, 24],
    [1, 24],
    [5, 24],
    [6, 24],
    [2, 34],
    [3, 34],
    [2, 35],
    [3, 35],
  ],
  pulsar: [2, 3, 4, 8, 9, 10].flatMap((c) =>
    [0, 5, 7, 12].flatMap((r): [number, number][] => [
      [r, c],
      [c, r],
    ]),
  ),
  "r-pentomino": [
    [0, 1],
    [0, 2],
    [1, 0],
    [1, 1],
    [2, 1],
  ],
  spaceships: [0, 10, 20].flatMap((o): [number, number][] =>
    [
      [0, 1],
      [0, 4],
      [1, 0],
      [2, 0],
      [2, 4],
      [3, 0],
      [3, 1],
      [3, 2],
      [3, 3],
    ].map(([r, c]) => [r! + o, c!]),
  ),
};

function step(cells: Uint8Array) {
  const next = new Uint8Array(cells.length);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let n = 0;
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          if (!dr && !dc) continue;
          // the board wraps around at the edges
          n +=
            cells[((r + dr + ROWS) % ROWS) * COLS + ((c + dc + COLS) % COLS)]!;
        }
      const alive = cells[r * COLS + c];
      next[r * COLS + c] = n === 3 || (alive && n === 2) ? 1 : 0;
    }
  }
  return next;
}

export default function Page() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sim = useRef({
    cells: new Uint8Array(ROWS * COLS),
    // brightness per cell, so dying cells fade out instead of vanishing
    glow: new Float32Array(ROWS * COLS),
    hover: -1,
    paint: null as 0 | 1 | null,
    cell: 12,
  });
  const [running, setRunning] = useState(false);
  const [speed, setSpeed] = useState(12);
  const [generation, setGeneration] = useState(0);
  const [population, setPopulation] = useState(0);

  function sync() {
    setPopulation(sim.current.cells.reduce((a, b) => a + b, 0));
  }

  function advance() {
    sim.current.cells = step(sim.current.cells);
    setGeneration((g) => g + 1);
    sync();
  }

  function randomize() {
    const s = sim.current;
    s.cells = s.cells.map(() => (Math.random() < 0.22 ? 1 : 0));
    setGeneration(0);
    sync();
  }

  function clear() {
    sim.current.cells = new Uint8Array(ROWS * COLS);
    setRunning(false);
    setGeneration(0);
    sync();
  }

  function preset(name: string) {
    const pattern = PRESETS[name]!;
    const h = Math.max(...pattern.map(([r]) => r)) + 1;
    const w = Math.max(...pattern.map(([, c]) => c)) + 1;
    const top = Math.floor((ROWS - h) / 2);
    const left = Math.floor((COLS - w) / 2);
    const cells = new Uint8Array(ROWS * COLS);
    for (const [r, c] of pattern) cells[(top + r) * COLS + left + c] = 1;
    sim.current.cells = cells;
    setGeneration(0);
    sync();
  }

  // start with something moving on screen
  useEffect(() => preset("glider gun"), []); // eslint-disable-line react-hooks/exhaustive-deps

  // size the canvas to its container
  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const resize = () => {
      const cell = wrap.clientWidth / COLS;
      const dpr = window.devicePixelRatio || 1;
      sim.current.cell = cell;
      canvas.style.width = `${cell * COLS}px`;
      canvas.style.height = `${cell * ROWS}px`;
      canvas.width = cell * COLS * dpr;
      canvas.height = cell * ROWS * dpr;
      canvas.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(wrap);
    return () => observer.disconnect();
  }, []);

  // render loop, always running for the fade effect
  useEffect(() => {
    let frame = 0;
    const draw = () => {
      const ctx = canvasRef.current?.getContext("2d");
      const s = sim.current;
      if (ctx) {
        const size = s.cell;
        ctx.fillStyle = "#101010";
        ctx.fillRect(0, 0, size * COLS, size * ROWS);
        for (let i = 0; i < s.cells.length; i++) {
          const target = s.cells[i]!;
          s.glow[i] = target ? 1 : s.glow[i]! * 0.88;
          const g = s.glow[i]!;
          const x = (i % COLS) * size;
          const y = Math.floor(i / COLS) * size;
          if (g > 0.03) {
            ctx.fillStyle = target
              ? "#d6bcbc"
              : `rgba(196, 160, 160, ${g * 0.35})`;
            ctx.beginPath();
            ctx.roundRect(x + 1, y + 1, size - 2, size - 2, size * 0.25);
            ctx.fill();
          } else {
            ctx.fillStyle = "rgba(255,255,255,0.025)";
            ctx.fillRect(x + size / 2 - 0.75, y + size / 2 - 0.75, 1.5, 1.5);
          }
        }
        if (s.hover >= 0) {
          ctx.strokeStyle = "rgba(255,255,255,0.5)";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(
            (s.hover % COLS) * size + 1,
            Math.floor(s.hover / COLS) * size + 1,
            size - 2,
            size - 2,
            size * 0.25,
          );
          ctx.stroke();
        }
      }
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!running) return;
    const interval = setInterval(advance, 1000 / speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, speed]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLSelectElement
      )
        return;
      if (e.key === " ") {
        e.preventDefault();
        setRunning((r) => !r);
      } else if (e.key === "ArrowRight" || e.key === "n") {
        advance();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function cellAt(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    const c = Math.floor((e.clientX - rect.left) / sim.current.cell);
    const r = Math.floor((e.clientY - rect.top) / sim.current.cell);
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return -1;
    return r * COLS + c;
  }

  function onDown(e: React.PointerEvent) {
    const i = cellAt(e);
    if (i < 0) return;
    canvasRef.current!.setPointerCapture(e.pointerId);
    const s = sim.current;
    // the first cell decides whether this stroke draws or erases
    s.paint = s.cells[i] ? 0 : 1;
    s.cells[i] = s.paint;
    sync();
  }

  function onMove(e: React.PointerEvent) {
    const s = sim.current;
    const i = cellAt(e);
    s.hover = i;
    if (s.paint === null || i < 0 || s.cells[i] === s.paint) return;
    s.cells[i] = s.paint;
    sync();
  }

  return (
    <GameShell
      title="Game of Life"
      subtitle="Draw on the grid. Space plays and pauses, → steps."
    >
      <Stats>
        <Stat label="generation" value={generation} accent />
        <Stat label="population" value={population} />
      </Stats>

      <div className="flex w-full flex-wrap items-center gap-2">
        <GameButton
          variant="solid"
          onClick={() => setRunning(!running)}
          className="w-24"
        >
          {running ? "Pause" : "Play"}
        </GameButton>
        <GameButton onClick={advance} disabled={running}>
          Step
        </GameButton>
        <GameButton onClick={randomize}>Random</GameButton>
        <GameButton onClick={clear}>Clear</GameButton>
        <select
          value=""
          onChange={(e) => e.target.value && preset(e.target.value)}
          className="focus-visible:border-primary rounded-md border border-white/10 bg-transparent px-3 py-1.5 text-sm text-neutral-200 outline-none hover:border-white/25"
        >
          <option value="" disabled>
            Presets…
          </option>
          {Object.keys(PRESETS).map((name) => (
            <option key={name} value={name} className="bg-neutral-900">
              {name}
            </option>
          ))}
        </select>
        <label className="ml-auto flex items-center gap-3 text-sm text-neutral-400">
          speed
          <input
            type="range"
            min={1}
            max={40}
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="accent-primary w-28"
          />
          <span className={cn(mono, "w-12 text-neutral-200 tabular-nums")}>
            {speed}/s
          </span>
        </label>
      </div>

      <div
        ref={wrapRef}
        className="w-full overflow-hidden rounded-lg border border-white/10"
      >
        <canvas
          ref={canvasRef}
          className="block cursor-crosshair touch-none"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={() => (sim.current.paint = null)}
          onPointerLeave={() => (sim.current.hover = -1)}
        />
      </div>
    </GameShell>
  );
}
