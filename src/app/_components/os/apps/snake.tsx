import { useCallback, useEffect, useRef, useState } from "react";

const SIZE = 16;
type Point = { x: number; y: number };

const directions: Record<string, Point> = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 },
  w: { x: 0, y: -1 },
  s: { x: 0, y: 1 },
  a: { x: -1, y: 0 },
  d: { x: 1, y: 0 },
};

function randomFood(snake: Point[]): Point {
  while (true) {
    const p = {
      x: Math.floor(Math.random() * SIZE),
      y: Math.floor(Math.random() * SIZE),
    };
    if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
  }
}

const start = () => [
  { x: 8, y: 8 },
  { x: 7, y: 8 },
  { x: 6, y: 8 },
];

export function Snake() {
  const [snake, setSnake] = useState<Point[]>(start);
  const [food, setFood] = useState<Point>({ x: 12, y: 8 });
  const [state, setState] = useState<"idle" | "playing" | "over">("idle");
  const [best, setBest] = useState(0);
  const dir = useRef<Point>({ x: 1, y: 0 });
  const queued = useRef<Point>({ x: 1, y: 0 });
  const boardRef = useRef<HTMLDivElement>(null);

  const score = snake.length - 3;

  const reset = useCallback(() => {
    setSnake(start());
    setFood({ x: 12, y: 8 });
    dir.current = queued.current = { x: 1, y: 0 };
    setState("playing");
    boardRef.current?.focus();
  }, []);

  useEffect(() => {
    if (state !== "playing") return;
    const id = setInterval(() => {
      dir.current = queued.current;
      setSnake((prev) => {
        const head = prev[0]!;
        const next = { x: head.x + dir.current.x, y: head.y + dir.current.y };
        const hitWall =
          next.x < 0 || next.y < 0 || next.x >= SIZE || next.y >= SIZE;
        const hitSelf = prev
          .slice(0, -1)
          .some((s) => s.x === next.x && s.y === next.y);
        if (hitWall || hitSelf) {
          setState("over");
          return prev;
        }
        const ate = next.x === food.x && next.y === food.y;
        const body = [next, ...prev];
        if (ate) setFood(randomFood(body));
        else body.pop();
        return body;
      });
    }, 110);
    return () => clearInterval(id);
  }, [state, food]);

  useEffect(() => {
    setBest((b) => Math.max(b, score));
  }, [score]);

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === " " && state !== "playing") {
      e.preventDefault();
      reset();
      return;
    }
    const d = directions[e.key];
    if (!d) return;
    e.preventDefault();
    // Disallow reversing straight into yourself.
    if (d.x === -dir.current.x && d.y === -dir.current.y) return;
    queued.current = d;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
      <div className="text-text-300 flex w-full max-w-[360px] justify-between text-sm">
        <span>Score: {score}</span>
        <span>Best: {best}</span>
      </div>
      <div
        ref={boardRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        className="relative grid aspect-square w-full max-w-[360px] rounded-md bg-black/30 ring-1 ring-white/10 outline-none focus:ring-white/30"
        style={{
          gridTemplateColumns: `repeat(${SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${SIZE}, 1fr)`,
        }}
      >
        {snake.map((s, i) => (
          <div
            key={i}
            className={`rounded-[3px] ${i === 0 ? "bg-white" : "bg-white/60"}`}
            style={{ gridColumn: s.x + 1, gridRow: s.y + 1, margin: 1 }}
          />
        ))}
        <div
          className="rounded-full bg-red-400"
          style={{ gridColumn: food.x + 1, gridRow: food.y + 1, margin: 2 }}
        />
        {state !== "playing" && (
          <button
            onClick={reset}
            className="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-md bg-black/60 backdrop-blur-sm"
          >
            <span className="text-2xl font-light lowercase">
              {state === "over" ? "Game over" : "Snake"}
            </span>
            <span className="text-text-300 text-sm">
              Click or press space to {state === "over" ? "retry" : "start"}
            </span>
          </button>
        )}
      </div>
      <p className="text-text-500 text-xs">Arrow keys or WASD</p>
    </div>
  );
}
