"use client";
import { useEffect, useRef, useState } from "react";

const SIZE = 8;
const CELL = 44;
const PAD = 16;
const TRAY_H = 120;
const W = SIZE * CELL + PAD * 2;
const H = SIZE * CELL + PAD * 2 + TRAY_H;

type Shape = [number, number][];

const SHAPES: Shape[] = [
  [[0, 0]],
  [[0, 0], [0, 1]],
  [[0, 0], [1, 0]],
  [[0, 0], [0, 1], [0, 2]],
  [[0, 0], [1, 0], [2, 0]],
  [[0, 0], [0, 1], [0, 2], [0, 3]],
  [[0, 0], [1, 0], [2, 0], [3, 0]],
  [[0, 0], [0, 1], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [0, 2], [1, 0], [1, 1], [1, 2], [2, 0], [2, 1], [2, 2]],
  [[0, 0], [1, 0], [1, 1]],
  [[0, 0], [0, 1], [1, 1]],
  [[0, 0], [0, 1], [1, 0]],
  [[0, 0], [1, 0], [2, 0], [2, 1]],
  [[0, 1], [1, 1], [2, 0], [2, 1]],
];

const COLORS = [
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
];

type Piece = { shape: Shape; color: string } | null;

function randomPiece(): Piece {
  return {
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)]!,
    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
  };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const game = useRef({
    board: Array.from({ length: SIZE }, () => Array<string | null>(SIZE).fill(null)),
    tray: [randomPiece(), randomPiece(), randomPiece()],
    drag: null as { index: number; x: number; y: number } | null,
    score: 0,
    over: false,
  });

  function canPlace(shape: Shape, row: number, col: number) {
    return shape.every(([r, c]) => {
      const rr = row + r;
      const cc = col + c;
      return rr >= 0 && rr < SIZE && cc >= 0 && cc < SIZE && !game.current.board[rr]![cc];
    });
  }

  function anyFits() {
    return game.current.tray.some((p) => {
      if (!p) return false;
      for (let r = 0; r < SIZE; r++)
        for (let c = 0; c < SIZE; c++) if (canPlace(p.shape, r, c)) return true;
      return false;
    });
  }

  function dropCell(shape: Shape, x: number, y: number) {
    const rows = Math.max(...shape.map(([r]) => r)) + 1;
    const cols = Math.max(...shape.map(([, c]) => c)) + 1;
    const col = Math.round((x - PAD - (cols * CELL) / 2) / CELL);
    const row = Math.round((y - PAD - (rows * CELL) / 2) / CELL);
    return { row, col };
  }

  function place(index: number, x: number, y: number) {
    const g = game.current;
    const piece = g.tray[index];
    if (!piece) return;
    const { row, col } = dropCell(piece.shape, x, y);
    if (!canPlace(piece.shape, row, col)) return;
    for (const [r, c] of piece.shape) g.board[row + r]![col + c] = piece.color;
    g.score += piece.shape.length;
    g.tray[index] = null;

    const fullRows = [];
    const fullCols = [];
    for (let i = 0; i < SIZE; i++) {
      if (g.board[i]!.every(Boolean)) fullRows.push(i);
      if (g.board.every((row) => row[i])) fullCols.push(i);
    }
    for (const r of fullRows) g.board[r]!.fill(null);
    for (const c of fullCols) for (const row of g.board) row[c] = null;
    g.score += (fullRows.length + fullCols.length) * 10;

    if (g.tray.every((p) => !p)) g.tray = [randomPiece(), randomPiece(), randomPiece()];
    if (!anyFits()) g.over = true;
    setScore(g.score);
  }

  function drawBlock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x + 2, y + 2, size - 4, size - 4, 6);
    ctx.fill();
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const g = game.current;

    ctx.clearRect(0, 0, W, H);

    // grid
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        const cell = g.board[r]![c];
        if (cell) {
          drawBlock(ctx, PAD + c * CELL, PAD + r * CELL, CELL, cell);
        } else {
          ctx.fillStyle = "#27272a";
          ctx.beginPath();
          ctx.roundRect(PAD + c * CELL + 2, PAD + r * CELL + 2, CELL - 4, CELL - 4, 6);
          ctx.fill();
        }
      }
    }

    // ghost preview
    if (g.drag && !g.over) {
      const piece = g.tray[g.drag.index];
      if (piece) {
        const { row, col } = dropCell(piece.shape, g.drag.x, g.drag.y);
        if (canPlace(piece.shape, row, col)) {
          ctx.globalAlpha = 0.4;
          for (const [r, c] of piece.shape)
            drawBlock(ctx, PAD + (col + c) * CELL, PAD + (row + r) * CELL, CELL, piece.color);
          ctx.globalAlpha = 1;
        }
      }
    }

    // tray
    const trayY = PAD + SIZE * CELL + PAD;
    const slotW = W / 3;
    const small = CELL * 0.5;
    g.tray.forEach((piece, i) => {
      if (!piece || g.drag?.index === i) return;
      const rows = Math.max(...piece.shape.map(([r]) => r)) + 1;
      const cols = Math.max(...piece.shape.map(([, c]) => c)) + 1;
      const ox = slotW * i + (slotW - cols * small) / 2;
      const oy = trayY + (TRAY_H - PAD - rows * small) / 2;
      for (const [r, c] of piece.shape)
        drawBlock(ctx, ox + c * small, oy + r * small, small, piece.color);
    });

    // dragged piece at full size under the pointer
    if (g.drag) {
      const piece = g.tray[g.drag.index];
      if (piece) {
        const rows = Math.max(...piece.shape.map(([r]) => r)) + 1;
        const cols = Math.max(...piece.shape.map(([, c]) => c)) + 1;
        for (const [r, c] of piece.shape)
          drawBlock(
            ctx,
            g.drag.x - (cols * CELL) / 2 + c * CELL,
            g.drag.y - (rows * CELL) / 2 + r * CELL,
            CELL,
            piece.color,
          );
      }
    }

    if (g.over) {
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.font = "bold 32px sans-serif";
      ctx.fillText("Game over", W / 2, H / 2 - 20);
      ctx.font = "18px sans-serif";
      ctx.fillText(`Score: ${g.score}`, W / 2, H / 2 + 12);
      ctx.fillText("Click to restart", W / 2, H / 2 + 40);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.getContext("2d")?.scale(dpr, dpr);
    draw();
  }, []);

  function pointerPos(e: React.PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onDown(e: React.PointerEvent) {
    const g = game.current;
    const { x, y } = pointerPos(e);
    if (g.over) {
      g.board = Array.from({ length: SIZE }, () => Array<string | null>(SIZE).fill(null));
      g.tray = [randomPiece(), randomPiece(), randomPiece()];
      g.score = 0;
      g.over = false;
      setScore(0);
      draw();
      return;
    }
    const trayY = PAD + SIZE * CELL + PAD;
    if (y < trayY) return;
    const index = Math.floor(x / (W / 3));
    if (g.tray[index]) {
      g.drag = { index, x, y };
      canvasRef.current?.setPointerCapture(e.pointerId);
      draw();
    }
  }

  function onMove(e: React.PointerEvent) {
    if (!game.current.drag) return;
    const { x, y } = pointerPos(e);
    game.current.drag = { ...game.current.drag, x, y };
    draw();
  }

  function onUp() {
    const g = game.current;
    if (!g.drag) return;
    place(g.drag.index, g.drag.x, g.drag.y);
    g.drag = null;
    draw();
  }

  return (
    <div className="flex flex-col items-center gap-4 pt-8">
      <h1 className="text-2xl font-bold">Blocks</h1>
      <p className="text-lg">Score: {score}</p>
      <canvas
        ref={canvasRef}
        style={{ width: W, height: H, touchAction: "none" }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
      />
    </div>
  );
}
