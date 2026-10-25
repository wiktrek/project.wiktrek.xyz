"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "~/app/_components/lib/utils";
import {
  GameButton,
  GameShell,
  NewBest,
  Stat,
  Stats,
  mono,
  overlay,
} from "../_components/shell";
import { useBest } from "../_components/use-best";

const SIZE = 8;
const CELL = 44;
const PAD = 14;
const TRAY_H = 130;
const W = SIZE * CELL + PAD * 2;
const H = SIZE * CELL + PAD * 2 + TRAY_H;
const TRAY_Y = PAD * 2 + SIZE * CELL;
const SMALL = CELL * 0.55;
const SAVE_KEY = "blocks:save";

type Shape = [number, number][];

const SHAPES: Shape[] = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3], [0, 4]],
  [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [1, 0]],
  [[0, 1], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [1, 1], [2, 0], [2, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0]],
  [[0, 0], [0, 1], [0, 2], [1, 2]],
  [[0, 0], [0, 1], [0, 2], [1, 1]],
  [[0, 1], [1, 0], [1, 1], [1, 2]],
  [[0, 0], [0, 1], [1, 1], [1, 2]],
  [[0, 1], [0, 2], [1, 0], [1, 1]],
  [[0, 0], [1, 0], [2, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 1]],
  [[0, 1], [1, 0]],
];

// [base, highlight] pairs, slightly muted so the board doesn't look like candy
const COLORS: [string, string][] = [
  ["#d0605a", "#e9a39d"],
  ["#d9864c", "#eeba90"],
  ["#d4ae4a", "#ead38f"],
  ["#5ea873", "#9fd0ab"],
  ["#4e98bf", "#95c5de"],
  ["#8875c4", "#bcb0e0"],
  ["#c46b97", "#e2a8c3"],
];

type Piece = { shape: number; color: number } | null;
type Board = (number | null)[][];
type Particle = { x: number; y: number; vx: number; vy: number; color: number; born: number };
type Float = { text: string; x: number; y: number; born: number; big: boolean };
type Clearing = { r: number; c: number; color: number; born: number };

const emptyBoard = (): Board =>
  Array.from({ length: SIZE }, () => Array<number | null>(SIZE).fill(null));

function bounds(shape: Shape) {
  return {
    rows: Math.max(...shape.map(([r]) => r)) + 1,
    cols: Math.max(...shape.map(([, c]) => c)) + 1,
  };
}

function canPlace(board: Board, shape: Shape, row: number, col: number) {
  return shape.every(([r, c]) => {
    const rr = row + r;
    const cc = col + c;
    return rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && board[rr]![cc] === null;
  });
}

function fitsAnywhere(board: Board, piece: Piece) {
  if (!piece) return false;
  const shape = SHAPES[piece.shape]!;
  for (let r = 0; r < SIZE; r++)
    for (let c = 0; c < SIZE; c++) if (canPlace(board, shape, r, c)) return true;
  return false;
}

/** rows and columns that would be full after placing the shape */
function linesAfter(board: Board, shape: Shape, row: number, col: number) {
  const filled = (r: number, c: number) =>
    board[r]![c] !== null || shape.some(([sr, sc]) => sr + row === r && sc + col === c);
  const rows: number[] = [];
  const cols: number[] = [];
  for (let i = 0; i < SIZE; i++) {
    if (Array.from({ length: SIZE }, (_, c) => filled(i, c)).every(Boolean)) rows.push(i);
    if (Array.from({ length: SIZE }, (_, r) => filled(r, i)).every(Boolean)) cols.push(i);
  }
  return { rows, cols };
}

function randomPiece(): Piece {
  return {
    shape: Math.floor(Math.random() * SHAPES.length),
    color: Math.floor(Math.random() * COLORS.length),
  };
}

// reroll a few times so a fresh tray is rarely dead on arrival
function newTray(board: Board): Piece[] {
  let tray = [randomPiece(), randomPiece(), randomPiece()];
  for (let i = 0; i < 12 && !tray.some((p) => fitsAnywhere(board, p)); i++)
    tray = [randomPiece(), randomPiece(), randomPiece()];
  return tray;
}

function drawBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: number,
  scale = 1,
) {
  const [base, light] = COLORS[color]!;
  const inset = size * 0.05;
  const s = (size - inset * 2) * scale;
  const bx = x + size / 2 - s / 2;
  const by = y + size / 2 - s / 2;
  const radius = s * 0.18;

  const gradient = ctx.createLinearGradient(bx, by, bx, by + s);
  gradient.addColorStop(0, light);
  gradient.addColorStop(0.45, base);
  gradient.addColorStop(1, base);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.roundRect(bx, by, s, s, radius);
  ctx.fill();

  // bevel: darker bottom edge and a soft top shine
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.roundRect(bx, by + s * 0.82, s, s * 0.18, [0, 0, radius, radius]);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.28)";
  ctx.beginPath();
  ctx.roundRect(bx + s * 0.14, by + s * 0.1, s * 0.72, s * 0.14, s * 0.07);
  ctx.fill();
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [over, setOver] = useState(false);
  const [newBest, setNewBest] = useState(false);
  const [best, submitBest] = useBest("blocks");
  const game = useRef({
    board: emptyBoard(),
    tray: [] as Piece[],
    drag: null as { index: number; x: number; y: number; lift: number; born: number } | null,
    score: 0,
    combo: 0,
    // placements since the last clear; the combo breaks after 3
    sinceClear: 0,
    over: false,
    clearing: [] as Clearing[],
    particles: [] as Particle[],
    floats: [] as Float[],
    shake: 0,
  });

  function save() {
    const g = game.current;
    if (g.over) localStorage.removeItem(SAVE_KEY);
    else
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ board: g.board, tray: g.tray, score: g.score, combo: g.combo }),
      );
  }

  function reset() {
    const g = game.current;
    if (!g.over && g.score) submitBest(g.score);
    g.board = emptyBoard();
    g.tray = newTray(g.board);
    g.score = 0;
    g.combo = 0;
    g.sinceClear = 0;
    g.over = false;
    g.clearing = [];
    g.floats = [];
    setScore(0);
    setCombo(0);
    setOver(false);
    setNewBest(false);
    save();
  }

  useEffect(() => {
    const g = game.current;
    try {
      const saved = JSON.parse(localStorage.getItem(SAVE_KEY) ?? "null") as {
        board: Board;
        tray: Piece[];
        score: number;
        combo: number;
      } | null;
      if (saved) {
        Object.assign(g, saved);
        setScore(saved.score);
        setCombo(saved.combo);
        return;
      }
    } catch {}
    reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dropCell(shape: Shape, x: number, y: number) {
    const { rows, cols } = bounds(shape);
    return {
      col: Math.round((x - PAD - (cols * CELL) / 2) / CELL),
      row: Math.round((y - PAD - (rows * CELL) / 2) / CELL),
    };
  }

  function place(index: number, x: number, y: number) {
    const g = game.current;
    const piece = g.tray[index];
    if (!piece) return false;
    const shape = SHAPES[piece.shape]!;
    const { row, col } = dropCell(shape, x, y);
    if (!canPlace(g.board, shape, row, col)) return false;

    const { rows, cols } = linesAfter(g.board, shape, row, col);
    for (const [r, c] of shape) g.board[row + r]![col + c] = piece.color;
    g.tray[index] = null;
    let gained = shape.length;

    const lines = rows.length + cols.length;
    const now = performance.now();
    if (lines) {
      g.combo++;
      g.sinceClear = 0;
      const cleared = new Set<string>();
      for (const r of rows) for (let c = 0; c < SIZE; c++) cleared.add(`${r},${c}`);
      for (const c of cols) for (let r = 0; r < SIZE; r++) cleared.add(`${r},${c}`);
      for (const key of cleared) {
        const [r, c] = key.split(",").map(Number) as [number, number];
        const color = g.board[r]![c]!;
        // stagger the pop outward from the placed piece
        const delay = (Math.abs(r - row) + Math.abs(c - col)) * 18;
        g.clearing.push({ r, c, color, born: now + delay });
        for (let i = 0; i < 3; i++)
          g.particles.push({
            x: PAD + c * CELL + CELL / 2,
            y: PAD + r * CELL + CELL / 2,
            vx: (Math.random() - 0.5) * 6,
            vy: -Math.random() * 6 - 1,
            color,
            born: now + delay,
          });
        g.board[r]![c] = null;
      }
      const bonus = 10 * lines * lines * g.combo;
      gained += bonus;
      g.shake = Math.min(10, 3 + lines * 2);
      const label = g.combo > 1 ? `+${bonus}  combo ×${g.combo}` : `+${bonus}`;
      g.floats.push({
        text: lines > 1 ? `${lines} lines! ${label}` : label,
        x: PAD + (col + bounds(shape).cols / 2) * CELL,
        y: PAD + row * CELL,
        born: now,
        big: lines > 1 || g.combo > 1,
      });
    } else if (++g.sinceClear >= 3) {
      g.combo = 0;
    }

    g.score += gained;
    if (g.tray.every((p) => !p)) g.tray = newTray(g.board);
    if (!g.tray.some((p) => fitsAnywhere(g.board, p))) {
      g.over = true;
      setOver(true);
      setNewBest(submitBest(g.score));
    }
    setScore(g.score);
    setCombo(g.combo);
    save();
    return true;
  }

  // render loop
  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const ctx = canvas.getContext("2d")!;
    const font =
      getComputedStyle(canvas).getPropertyValue("--font-geist-mono") ||
      "ui-monospace, monospace";
    let frame = 0;

    const draw = (now: number) => {
      const g = game.current;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);

      ctx.save();
      if (g.shake > 0.2) {
        ctx.translate((Math.random() - 0.5) * g.shake, (Math.random() - 0.5) * g.shake);
        g.shake *= 0.85;
      }

      // board panel
      ctx.fillStyle = "#121212";
      ctx.beginPath();
      ctx.roundRect(4, 4, W - 8, SIZE * CELL + PAD * 2 - 8, 10);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // preview of where the dragged piece lands and what it clears
      let ghost: { shape: Shape; row: number; col: number; color: number } | null = null;
      let hl = { rows: [] as number[], cols: [] as number[] };
      if (g.drag && !g.over) {
        const piece = g.tray[g.drag.index];
        if (piece) {
          const shape = SHAPES[piece.shape]!;
          const { row, col } = dropCell(shape, g.drag.x, g.drag.y - g.drag.lift);
          if (canPlace(g.board, shape, row, col)) {
            ghost = { shape, row, col, color: piece.color };
            hl = linesAfter(g.board, shape, row, col);
          }
        }
      }

      for (let r = 0; r < SIZE; r++) {
        for (let c = 0; c < SIZE; c++) {
          const x = PAD + c * CELL;
          const y = PAD + r * CELL;
          const cell = g.board[r]![c]!;
          const lit = hl.rows.includes(r) || hl.cols.includes(c);
          if (cell !== null) {
            drawBlock(ctx, x, y, CELL, lit && ghost ? ghost.color : cell);
            if (lit) {
              ctx.fillStyle = `rgba(255,255,255,${0.12 + Math.sin(now / 90) * 0.08})`;
              ctx.beginPath();
              ctx.roundRect(x + 2, y + 2, CELL - 4, CELL - 4, 8);
              ctx.fill();
            }
          } else {
            ctx.fillStyle = lit ? "rgba(255,255,255,0.09)" : "#1c1c1c";
            ctx.beginPath();
            ctx.roundRect(x + 2.5, y + 2.5, CELL - 5, CELL - 5, 7);
            ctx.fill();
          }
        }
      }

      if (ghost) {
        ctx.globalAlpha = 0.35;
        for (const [r, c] of ghost.shape)
          drawBlock(ctx, PAD + (ghost.col + c) * CELL, PAD + (ghost.row + r) * CELL, CELL, ghost.color);
        ctx.globalAlpha = 1;
      }

      // cells popping after a clear
      g.clearing = g.clearing.filter((cl) => {
        const t = (now - cl.born) / 260;
        if (t >= 1) return false;
        const p = Math.max(0, t);
        ctx.globalAlpha = 1 - p;
        drawBlock(ctx, PAD + cl.c * CELL, PAD + cl.r * CELL, CELL, cl.color, 1 + p * 0.35);
        ctx.fillStyle = `rgba(255,255,255,${(1 - p) * 0.6})`;
        ctx.beginPath();
        ctx.roundRect(PAD + cl.c * CELL + 2, PAD + cl.r * CELL + 2, CELL - 4, CELL - 4, 8);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      g.particles = g.particles.filter((pt) => {
        const age = now - pt.born;
        if (age > 700) return false;
        if (age < 0) return true;
        pt.x += pt.vx;
        pt.y += pt.vy;
        pt.vy += 0.35;
        ctx.globalAlpha = 1 - age / 700;
        ctx.fillStyle = COLORS[pt.color]![1];
        ctx.fillRect(pt.x - 3, pt.y - 3, 6, 6);
        ctx.globalAlpha = 1;
        return true;
      });

      // tray
      const slotW = W / 3;
      g.tray.forEach((piece, i) => {
        if (!piece || g.drag?.index === i) return;
        const shape = SHAPES[piece.shape]!;
        const { rows, cols } = bounds(shape);
        const ox = slotW * i + (slotW - cols * SMALL) / 2;
        const oy = TRAY_Y + (TRAY_H - rows * SMALL) / 2;
        ctx.globalAlpha = fitsAnywhere(g.board, piece) ? 1 : 0.25;
        for (const [r, c] of shape) drawBlock(ctx, ox + c * SMALL, oy + r * SMALL, SMALL, piece.color);
        ctx.globalAlpha = 1;
      });

      // dragged piece grows from tray size to board size
      if (g.drag) {
        const piece = g.tray[g.drag.index];
        if (piece) {
          const shape = SHAPES[piece.shape]!;
          const { rows, cols } = bounds(shape);
          const grow = Math.min(1, (now - g.drag.born) / 120);
          const size = SMALL + (CELL - SMALL) * (1 - Math.pow(1 - grow, 3));
          const cx = g.drag.x;
          const cy = g.drag.y - g.drag.lift * grow;
          const left = cx - (cols * size) / 2;
          const top = cy - (rows * size) / 2;
          ctx.fillStyle = "rgba(0,0,0,0.35)";
          for (const [r, c] of shape) {
            ctx.beginPath();
            ctx.roundRect(left + c * size + 3, top + r * size + 10, size - 4, size - 4, 8);
            ctx.fill();
          }
          for (const [r, c] of shape)
            drawBlock(ctx, left + c * size, top + r * size, size, piece.color);
        }
      }

      // floating score text
      g.floats = g.floats.filter((f) => {
        const t = (now - f.born) / 1100;
        if (t >= 1) return false;
        ctx.globalAlpha = 1 - t * t;
        ctx.font = `500 ${f.big ? 18 : 15}px ${font}`;
        ctx.textAlign = "center";
        const x = Math.min(W - 90, Math.max(90, f.x));
        const y = f.y - t * 40;
        ctx.lineWidth = 5;
        ctx.strokeStyle = "rgba(0,0,0,0.6)";
        ctx.strokeText(f.text, x, y);
        ctx.fillStyle = f.big ? "#e8cfcf" : "#f5f5f5";
        ctx.fillText(f.text, x, y);
        ctx.globalAlpha = 1;
        return true;
      });

      ctx.restore();
      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // canvas is scaled with CSS, so map pointer coords back to game units
  function pointerPos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * W,
      y: ((e.clientY - rect.top) / rect.height) * H,
    };
  }

  function onDown(e: React.PointerEvent) {
    const g = game.current;
    if (g.over) return;
    const { x, y } = pointerPos(e);
    if (y < TRAY_Y - PAD) return;
    const index = Math.min(2, Math.floor(x / (W / 3)));
    if (!g.tray[index]) return;
    // lift the piece above a finger so it stays visible on touch screens
    const lift = e.pointerType === "touch" ? CELL * 1.8 : CELL * 0.6;
    g.drag = { index, x, y, lift, born: performance.now() };
    canvasRef.current?.setPointerCapture(e.pointerId);
  }

  function onMove(e: React.PointerEvent) {
    const g = game.current;
    if (!g.drag) return;
    const { x, y } = pointerPos(e);
    g.drag = { ...g.drag, x, y };
  }

  function onUp() {
    const g = game.current;
    if (!g.drag) return;
    place(g.drag.index, g.drag.x, g.drag.y - g.drag.lift);
    g.drag = null;
  }

  return (
    <GameShell
      title="Blocks"
      subtitle="Drag pieces onto the board. Fill rows or columns to clear them."
      actions={
        <GameButton onClick={reset}>New game</GameButton>
      }
    >
      <Stats className="max-w-[380px]">
        <Stat label="score" value={score} accent />
        <Stat label="combo" value={combo > 1 ? `×${combo}` : "–"} />
        <Stat label="best" value={best ?? "–"} />
      </Stats>
      <div className="relative w-full max-w-[380px]">
        <canvas
          ref={canvasRef}
          className="block w-full select-none"
          style={{ aspectRatio: `${W} / ${H}`, touchAction: "none" }}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={() => (game.current.drag = null)}
        />
        <AnimatePresence>
          {over && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.4 }}
              className={overlay}
            >
              {newBest && <NewBest />}
              <p className="text-sm text-neutral-400">No moves left</p>
              <p className={cn(mono, "text-6xl tabular-nums text-neutral-50")}>{score}</p>
              <GameButton variant="solid" onClick={reset} className="mt-2">
                Play again
              </GameButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
