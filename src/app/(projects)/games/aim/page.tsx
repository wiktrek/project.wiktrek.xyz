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

const DURATION = 30;
const TARGET = 56;

type Phase = "idle" | "playing" | "done";
type Target = { id: number; x: number; y: number; born: number };
type Effect = {
  id: number;
  x: number;
  y: number;
  hit: boolean;
  label?: string;
};

let nextId = 0;

export default function Page() {
  const arenaRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [target, setTarget] = useState<Target | null>(null);
  const [effects, setEffects] = useState<Effect[]>([]);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(DURATION);
  const [newBest, setNewBest] = useState(false);
  const [best, submitBest] = useBest("aim");
  const endsAt = useRef(0);

  function spawn() {
    const arena = arenaRef.current;
    if (!arena) return;
    const { width, height } = arena.getBoundingClientRect();
    const m = TARGET / 2 + 8;
    setTarget({
      id: nextId++,
      x: m + Math.random() * (width - m * 2),
      y: m + Math.random() * (height - m * 2),
      born: performance.now(),
    });
  }

  function start() {
    setHits(0);
    setMisses(0);
    setTimes([]);
    setEffects([]);
    setNewBest(false);
    setTimeLeft(DURATION);
    endsAt.current = performance.now() + DURATION * 1000;
    setPhase("playing");
    spawn();
  }

  useEffect(() => {
    if (phase !== "playing") return;
    const interval = setInterval(() => {
      const left = Math.max(0, (endsAt.current - performance.now()) / 1000);
      setTimeLeft(left);
      if (left <= 0) {
        setPhase("done");
        setTarget(null);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [phase]);

  useEffect(() => {
    if (phase === "done") setNewBest(submitBest(hits));
    // only when a round finishes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  function addEffect(effect: Omit<Effect, "id">) {
    const id = nextId++;
    setEffects((e) => [...e, { ...effect, id }]);
    setTimeout(() => setEffects((e) => e.filter((x) => x.id !== id)), 600);
  }

  function localPos(e: React.PointerEvent) {
    const rect = arenaRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  function onArenaDown(e: React.PointerEvent) {
    if (phase !== "playing") return;
    setMisses((m) => m + 1);
    addEffect({ ...localPos(e), hit: false });
  }

  function onTargetDown(e: React.PointerEvent) {
    e.stopPropagation();
    if (!target) return;
    const ms = Math.round(performance.now() - target.born);
    setHits((h) => h + 1);
    setTimes((t) => [...t, ms]);
    addEffect({ x: target.x, y: target.y, hit: true, label: `${ms}ms` });
    spawn();
  }

  const shots = hits + misses;
  const accuracy = shots ? Math.round((hits / shots) * 100) : 100;
  const avg = times.length
    ? Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    : 0;

  return (
    <GameShell
      title="Aim"
      subtitle={`Hit as many targets as you can in ${DURATION} seconds.`}
      actions={
        phase === "playing" && <GameButton onClick={start}>Restart</GameButton>
      }
    >
      <Stats>
        <Stat label="hits" value={hits} accent />
        <Stat label="accuracy" value={`${accuracy}%`} />
        <Stat label="average" value={avg ? `${avg}ms` : "–"} />
        <Stat label="best" value={best ?? "–"} />
      </Stats>

      <div
        ref={arenaRef}
        onPointerDown={onArenaDown}
        className="relative h-[min(60vh,520px)] min-h-72 w-full touch-none overflow-hidden rounded-lg border border-white/10 bg-neutral-950 select-none"
        style={{
          cursor: phase === "playing" ? "crosshair" : "default",
          backgroundImage:
            "radial-gradient(circle at center, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        {/* timer bar */}
        <div className="absolute inset-x-0 top-0 h-0.5 bg-white/5">
          <div
            className="bg-primary h-full transition-[width] duration-75 ease-linear"
            style={{ width: `${(timeLeft / DURATION) * 100}%` }}
          />
        </div>
        {phase === "playing" && (
          <span
            className={cn(
              mono,
              "pointer-events-none absolute top-3 right-4 text-sm text-neutral-500 tabular-nums",
            )}
          >
            {timeLeft.toFixed(1)}s
          </span>
        )}

        {target && (
          <motion.button
            key={target.id}
            aria-label="target"
            onPointerDown={onTargetDown}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 600, damping: 26 }}
            className="absolute rounded-full"
            style={{
              left: target.x - TARGET / 2,
              top: target.y - TARGET / 2,
              width: TARGET,
              height: TARGET,
              background:
                "radial-gradient(circle, #f5efef 0 14%, #c98b8b 15% 36%, #f5efef 37% 56%, #c98b8b 57% 100%)",
            }}
          />
        )}

        {effects.map((fx) =>
          fx.hit ? (
            <div
              key={fx.id}
              className="pointer-events-none absolute"
              style={{ left: fx.x, top: fx.y }}
            >
              <motion.div
                initial={{ scale: 0.4, opacity: 0.8 }}
                animate={{ scale: 2.2, opacity: 0 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
                className="border-primary absolute -top-7 -left-7 h-14 w-14 rounded-full border"
              />
              <motion.span
                initial={{ y: -10, opacity: 1 }}
                animate={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className={cn(
                  mono,
                  "absolute -translate-x-1/2 text-xs whitespace-nowrap text-neutral-300 tabular-nums",
                )}
              >
                {fx.label}
              </motion.span>
            </div>
          ) : (
            <motion.div
              key={fx.id}
              initial={{ scale: 0.5, opacity: 1 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pointer-events-none absolute -mt-3 -ml-3 flex h-6 w-6 items-center justify-center text-lg text-neutral-600"
              style={{ left: fx.x, top: fx.y }}
            >
              ×
            </motion.div>
          ),
        )}

        <AnimatePresence>
          {phase !== "playing" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={overlay}
            >
              {phase === "idle" ? (
                <p className="max-w-xs text-sm text-pretty text-neutral-400">
                  Targets appear one at a time. Missed clicks count against your
                  accuracy.
                </p>
              ) : (
                <>
                  {newBest && <NewBest />}
                  <p
                    className={cn(
                      mono,
                      "text-6xl text-neutral-50 tabular-nums",
                    )}
                  >
                    {hits}
                  </p>
                  <p className="text-sm text-neutral-400">
                    {accuracy}% accuracy · {avg || "–"}ms average
                  </p>
                </>
              )}
              <GameButton variant="solid" onClick={start}>
                {phase === "idle" ? "Start" : "Play again"}
              </GameButton>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </GameShell>
  );
}
