"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from "lucide-react";
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

const GRID = 20;
const SIZE = 480;
const CELL = SIZE / GRID;
const START_SPEED = 130;
const MIN_SPEED = 60;

type Point = { x: number; y: number };
type Dir = "up" | "down" | "left" | "right";
type Phase = "idle" | "playing" | "paused" | "over";

const VECTORS: Record<Dir, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const OPPOSITE: Record<Dir, Dir> = { up: "down", down: "up", left: "right", right: "left" };
const KEYS: Record<string, Dir> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

function startSnake(): Point[] {
  return [
    { x: 6, y: 10 },
    { x: 5, y: 10 },
    { x: 4, y: 10 },
  ];
}

function randomFood(snake: Point[]): Point {
  const free: Point[] = [];
  for (let x = 0; x < GRID; x++)
    for (let y = 0; y < GRID; y++)
      if (!snake.some((s) => s.x === x && s.y === y)) free.push({ x, y });
  return free[Math.floor(Math.random() * free.length)] ?? { x: 0, y: 0 };
}

export default function Page() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [best, submitBest] = useBest("snake");
  const game = useRef({
    snake: startSnake(),
    prev: startSnake(),
    dir: "right" as Dir,
    // turns pressed faster than the snake moves are buffered, not dropped
    queue: [] as Dir[],
    food: { x: 14, y: 10 },
    speed: START_SPEED,
    lastTick: 0,
    phase: "idle" as Phase,
    score: 0,
    particles: [] as { x: number; y: number; vx: number; vy: number; born: number }[],
    deathAt: 0,
  });

  function setGamePhase(p: Phase) {
    game.current.phase = p;
    setPhase(p);
  }

  function start() {
    const g = game.current;
    g.snake = startSnake();
    g.prev = startSnake();
    g.dir = "right";
    g.queue = [];
    g.food = randomFood(g.snake);
    g.speed = START_SPEED;
    g.score = 0;
    g.lastTick = performance.now();
    setScore(0);
    setNewBest(false);
    setGamePhase("playing");
  }

  function turn(dir: Dir) {
    const g = game.current;
    if (g.phase === "idle" || g.phase === "over") {
      start();
    }
    if (g.phase === "paused") setGamePhase("playing");
    const last = g.queue[g.queue.length - 1] ?? g.dir;
    if (dir === last || dir === OPPOSITE[last] || g.queue.length >= 3) return;
    g.queue.push(dir);
  }

  function togglePause() {
    const g = game.current;
    if (g.phase === "playing") setGamePhase("paused");
    else if (g.phase === "paused") {
      g.lastTick = performance.now();
      setGamePhase("playing");
    }
  }

  function tick(now: number) {
    const g = game.current;
    g.dir = g.queue.shift() ?? g.dir;
    const v = VECTORS[g.dir];
    const head = g.snake[0]!;
    const next = { x: head.x + v.x, y: head.y + v.y };
    const eating = next.x === g.food.x && next.y === g.food.y;
    // the tail moves out of the way unless the snake grows this tick
    const body = eating ? g.snake : g.snake.slice(0, -1);
    const dead =
      next.x < 0 ||
      next.y < 0 ||
      next.x >= GRID ||
      next.y >= GRID ||
      body.some((s) => s.x === next.x && s.y === next.y);
    if (dead) {
      g.deathAt = now;
      g.prev = g.snake;
      setGamePhase("over");
      setNewBest(submitBest(g.score));
      navigator.vibrate?.(80);
      return;
    }
    g.prev = eating ? [...g.snake, g.snake[g.snake.length - 1]!] : g.snake;
    g.snake = [next, ...body];
    if (eating) {
      g.score++;
      setScore(g.score);
      g.speed = Math.max(MIN_SPEED, g.speed - 3);
      for (let i = 0; i < 12; i++) {
        const a = (Math.PI * 2 * i) / 12;
        g.particles.push({
          x: (g.food.x + 0.5) * CELL,
          y: (g.food.y + 0.5) * CELL,
          vx: Math.cos(a) * (2 + Math.random() * 2),
          vy: Math.sin(a) * (2 + Math.random() * 2),
          born: now,
        });
      }
      g.food = randomFood(g.snake);
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current!;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = SIZE * dpr;
    canvas.height = SIZE * dpr;
    const ctx = canvas.getContext("2d")!;
    let frame = 0;

    const draw = (now: number) => {
      const g = game.current;
      if (g.phase === "playing") {
        // after a long stall, resume instead of fast-forwarding into a wall
        if (now - g.lastTick > 500) g.lastTick = now - g.speed;
        while (now - g.lastTick >= g.speed && g.phase === "playing") {
          g.lastTick += g.speed;
          tick(now);
        }
      }
      const t =
        g.phase === "playing" ? Math.min(1, (now - g.lastTick) / g.speed) : 1;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, SIZE, SIZE);
      // checkerboard
      ctx.fillStyle = "rgba(255,255,255,0.015)";
      for (let x = 0; x < GRID; x++)
        for (let y = 0; y < GRID; y++)
          if ((x + y) % 2) ctx.fillRect(x * CELL, y * CELL, CELL, CELL);

      // food
      const pulse = 1 + Math.sin(now / 180) * 0.08;
      const fx = (g.food.x + 0.5) * CELL;
      const fy = (g.food.y + 0.5) * CELL;
      ctx.fillStyle = "#d39a9a";
      ctx.beginPath();
      ctx.arc(fx, fy, CELL * 0.3 * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.beginPath();
      ctx.arc(fx - CELL * 0.1, fy - CELL * 0.1, CELL * 0.08, 0, Math.PI * 2);
      ctx.fill();

      // snake body as one smooth stroke through interpolated segment centers
      const points = g.snake.map((s, i) => {
        const p = g.prev[i] ?? s;
        return {
          x: (p.x + (s.x - p.x) * t + 0.5) * CELL,
          y: (p.y + (s.y - p.y) * t + 0.5) * CELL,
        };
      });
      const dying = g.phase === "over" && now - g.deathAt < 400;
      const flash = dying && Math.floor((now - g.deathAt) / 80) % 2 === 0;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (let i = points.length - 1; i > 0; i--) {
        const a = points[i]!;
        const b = points[i - 1]!;
        const k = i / points.length;
        ctx.strokeStyle = flash
          ? "#e3c1c1"
          : g.phase === "over"
            ? `hsl(0, 0%, ${45 - k * 20}%)`
            : `hsl(140, 30%, ${58 - k * 22}%)`;
        ctx.lineWidth = CELL * (0.72 - k * 0.22);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      // head with eyes looking where it's going
      const head = points[0]!;
      const v = VECTORS[g.dir];
      ctx.fillStyle = flash ? "#e3c1c1" : g.phase === "over" ? "#a3a3a3" : "#7fb38d";
      ctx.beginPath();
      ctx.arc(head.x, head.y, CELL * 0.42, 0, Math.PI * 2);
      ctx.fill();
      const side = { x: -v.y, y: v.x };
      for (const s of [-1, 1]) {
        const ex = head.x + v.x * CELL * 0.14 + side.x * s * CELL * 0.18;
        const ey = head.y + v.y * CELL * 0.14 + side.y * s * CELL * 0.18;
        ctx.fillStyle = "#fff";
        ctx.beginPath();
        ctx.arc(ex, ey, CELL * 0.11, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#111";
        ctx.beginPath();
        ctx.arc(ex + v.x * CELL * 0.04, ey + v.y * CELL * 0.04, CELL * 0.055, 0, Math.PI * 2);
        ctx.fill();
      }

      g.particles = g.particles.filter((p) => {
        const age = now - p.born;
        if (age > 500) return false;
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.92;
        p.vy *= 0.92;
        ctx.globalAlpha = 1 - age / 500;
        ctx.fillStyle = "#e3c1c1";
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
        return true;
      });

      frame = requestAnimationFrame(draw);
    };
    frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement) return;
      const dir = KEYS[e.key] ?? KEYS[e.key.toLowerCase()];
      if (dir) {
        e.preventDefault();
        turn(dir);
      } else if (e.key === " " || e.key === "p" || e.key === "Escape") {
        e.preventDefault();
        const g = game.current;
        if (g.phase === "idle" || g.phase === "over") start();
        else togglePause();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // pause when the tab is hidden so you don't come back to a dead snake
  useEffect(() => {
    const onHide = () => document.hidden && game.current.phase === "playing" && togglePause();
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const swipe = useRef<Point | null>(null);

  return (
    <GameShell
      title="Snake"
      subtitle="Arrows or WASD to steer, space to pause. Swipe on touch screens."
      actions={
        (phase === "playing" || phase === "paused") && (
          <GameButton onClick={togglePause}>
            {phase === "paused" ? "Resume" : "Pause"}
          </GameButton>
        )
      }
    >
      <Stats className="max-w-[480px]">
        <Stat label="score" value={score} accent />
        <Stat label="best" value={best ?? "–"} />
      </Stats>

      <div className="relative w-full max-w-[480px]">
        <canvas
          ref={canvasRef}
          className="block aspect-square w-full touch-none rounded-lg border border-white/10"
          onPointerDown={(e) => (swipe.current = { x: e.clientX, y: e.clientY })}
          onPointerUp={(e) => {
            const s = swipe.current;
            swipe.current = null;
            if (!s) return;
            const dx = e.clientX - s.x;
            const dy = e.clientY - s.y;
            if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) return;
            turn(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : dy > 0 ? "down" : "up");
          }}
        />
        <AnimatePresence>
          {phase !== "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: phase === "over" ? 0.4 : 0 }}
              className={overlay}
            >
              {phase === "over" && newBest && <NewBest />}
              {phase === "over" && (
                <p className={cn(mono, "text-6xl tabular-nums text-neutral-50")}>{score}</p>
              )}
              {phase === "paused" && <p className="text-xl font-semibold text-neutral-50">Paused</p>}
              <GameButton
                variant="solid"
                onClick={phase === "paused" ? togglePause : start}
              >
                {phase === "idle" ? "Start" : phase === "paused" ? "Resume" : "Play again"}
              </GameButton>
              <p className="text-xs text-neutral-500">
                {phase === "paused" ? "or press space" : "or press any arrow key"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* d-pad for touch screens */}
      <div className="grid grid-cols-3 gap-2 sm:hidden">
        <span />
        <DPad dir="up" onPress={turn} icon={ChevronUp} />
        <span />
        <DPad dir="left" onPress={turn} icon={ChevronLeft} />
        <DPad dir="down" onPress={turn} icon={ChevronDown} />
        <DPad dir="right" onPress={turn} icon={ChevronRight} />
      </div>
    </GameShell>
  );
}

function DPad({
  dir,
  onPress,
  icon: Icon,
}: {
  dir: Dir;
  onPress: (dir: Dir) => void;
  icon: typeof ChevronUp;
}) {
  return (
    <button
      aria-label={dir}
      onPointerDown={(e) => {
        e.preventDefault();
        onPress(dir);
      }}
      className="flex h-14 w-14 touch-manipulation items-center justify-center rounded-lg border border-white/10 text-neutral-300 active:translate-y-px active:bg-white/[0.06]"
    >
      <Icon className="h-6 w-6" />
    </button>
  );
}
