"use client";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "~/app/_components/lib/utils";
import { Choice, GameShell, Stat, Stats, mono } from "../_components/shell";

interface Item {
  // ids match the old save format so existing progress carries over
  id: string;
  name: string;
  note: string;
  price: number;
  perSecond: number;
}

const ITEMS: Item[] = [
  { id: "cursor", name: "Script", note: "a bash loop", price: 10, perSecond: 0.5 },
  { id: "cook", name: "Cron job", note: "runs every minute", price: 100, perSecond: 3 },
  { id: "engineer", name: "Worker", note: "pulls from a queue", price: 1_000, perSecond: 15 },
  { id: "factory", name: "Rack", note: "42U of workers", price: 12_000, perSecond: 80 },
  { id: "lab", name: "Cluster", note: "autoscaling, mostly", price: 130_000, perSecond: 450 },
  { id: "portal", name: "Region", note: "now in eu-west", price: 1_400_000, perSecond: 2_600 },
];

const SAVE_KEY = "clicker:v2";
const TICK = 100;
const HISTORY = 48;
const SLOTS = 20;
const AMOUNTS = ["1", "10", "max"] as const;
type Amount = (typeof AMOUNTS)[number];

type Owned = Record<string, number>;
type Pop = { id: number; x: number; value: number };

function getPrice(item: Item, owned: number) {
  return Math.ceil(item.price * Math.pow(1.15, owned));
}

/** How many to buy and what it costs, for the selected amount. */
function quote(item: Item, owned: number, money: number, amount: Amount) {
  let count = 0;
  let cost = 0;
  const limit = amount === "max" ? 1000 : Number(amount);
  while (count < limit) {
    const next = getPrice(item, owned + count);
    // for max, stop at what you can afford; fixed amounts show the full cost
    if (amount === "max" && cost + next > money) break;
    cost += next;
    count++;
  }
  // max with nothing affordable still quotes one, so the row shows a price
  if (count === 0) return { count: 1, cost: getPrice(item, owned) };
  return { count, cost };
}

function income(owned: Owned) {
  return ITEMS.reduce((sum, i) => sum + i.perSecond * (owned[i.id] ?? 0), 0);
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
function format(n: number) {
  return n < 10_000 ? Math.floor(n).toLocaleString("en") : compact.format(n);
}
// rates can be fractional, e.g. 0.5/s from a single script
function formatRate(n: number) {
  return n < 100 ? String(Math.round(n * 10) / 10) : format(n);
}

function load(): { money: number; owned: Owned } {
  const saved = localStorage.getItem(SAVE_KEY);
  if (saved) return JSON.parse(saved) as { money: number; owned: Owned };
  // migrate saves from the old version
  const oldItems = localStorage.getItem("items");
  const owned: Owned = {};
  if (oldItems) {
    for (const i of JSON.parse(oldItems) as { name: string; quantity: number }[])
      owned[i.name] = i.quantity;
  }
  return { money: Number(localStorage.getItem("money") ?? 0) || 0, owned };
}

let popId = 0;

export default function Page() {
  const [money, setMoney] = useState(0);
  const [owned, setOwned] = useState<Owned>({});
  const [total, setTotal] = useState(0);
  const [hydrated, setHydrated] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);
  const [amount, setAmount] = useState<Amount>("1");
  const [history, setHistory] = useState<number[]>(() =>
    Array<number>(HISTORY).fill(0),
  );
  const [pressed, setPressed] = useState(false);
  const state = useRef({ money: 0, owned: {} as Owned });
  state.current = { money, owned };
  // earnings in the current second, flushed into the throughput strip
  const thisSecond = useRef(0);

  useEffect(() => {
    const saved = load();
    setMoney(saved.money);
    setOwned(saved.owned);
    setHydrated(true);
  }, []);

  const perSecond = income(owned);
  const clickValue = 1 + Math.floor(perSecond * 0.05);

  function earn(n: number) {
    setMoney((m) => m + n);
    setTotal((t) => t + n);
    thisSecond.current += n;
  }

  useEffect(() => {
    if (!hydrated) return;
    const gain = (perSecond * TICK) / 1000;
    const tick = setInterval(() => earn(gain), TICK);
    return () => clearInterval(tick);
  }, [perSecond, hydrated]);

  useEffect(() => {
    const flush = setInterval(() => {
      const n = thisSecond.current;
      thisSecond.current = 0;
      setHistory((h) => [...h.slice(1), n]);
    }, 1000);
    return () => clearInterval(flush);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const save = () =>
      localStorage.setItem(SAVE_KEY, JSON.stringify(state.current));
    const interval = setInterval(save, 2000);
    window.addEventListener("beforeunload", save);
    return () => {
      save();
      clearInterval(interval);
      window.removeEventListener("beforeunload", save);
    };
  }, [hydrated]);

  function run(x: number) {
    earn(clickValue);
    const id = popId++;
    setPops((p) => [...p.slice(-12), { id, x, value: clickValue }]);
    setTimeout(() => setPops((p) => p.filter((q) => q.id !== id)), 700);
  }

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    run((e.clientX - rect.left) / rect.width);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== " " && e.key !== "Enter") return;
    e.preventDefault();
    // holding the key down doesn't count
    if (e.repeat) return;
    setPressed(true);
    run(0.3 + Math.random() * 0.4);
  }

  function buy(item: Item) {
    const count = owned[item.id] ?? 0;
    const q = quote(item, count, money, amount);
    if (money < q.cost) return;
    setMoney(money - q.cost);
    setOwned({ ...owned, [item.id]: count + q.count });
  }

  const peak = Math.max(1, ...history);
  const lastSecond = history[HISTORY - 1] ?? 0;

  return (
    <GameShell
      title="Clicker"
      subtitle="Run jobs by hand until you can afford to stop."
      className="items-stretch"
    >
      <div className="grid gap-12 lg:grid-cols-[1fr_1.15fr]">
        <section className="flex flex-col gap-8">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-neutral-500">ops processed</span>
            <p
              className={cn(
                mono,
                "text-5xl tabular-nums tracking-tight text-neutral-50 sm:text-6xl",
              )}
            >
              {format(money)}
            </p>
            <p className={cn(mono, "text-sm tabular-nums text-neutral-400")}>
              <span className="text-primary">+{formatRate(perSecond)}</span>{" "}
              ops/s automated
            </p>
          </div>

          <figure className="flex flex-col gap-2">
            <div
              aria-hidden
              className="flex h-16 items-end gap-[3px] border-b border-white/10"
            >
              {history.map((n, i) => (
                <span
                  key={i}
                  className={cn(
                    "flex-1 rounded-t-[1px] transition-[height] duration-300",
                    i === HISTORY - 1 ? "bg-primary" : "bg-white/15",
                  )}
                  style={{ height: `${n > 0 ? Math.max(4, (n / peak) * 100) : 0}%` }}
                />
              ))}
            </div>
            <figcaption
              className={cn(
                mono,
                "flex justify-between text-xs tabular-nums text-neutral-500",
              )}
            >
              <span>throughput, last {HISTORY}s</span>
              <span>{formatRate(lastSecond)}/s</span>
            </figcaption>
          </figure>

          <div className="relative">
            <motion.button
              onPointerDown={onPointerDown}
              onKeyDown={onKeyDown}
              onKeyUp={() => setPressed(false)}
              onBlur={() => setPressed(false)}
              whileTap={{ y: 5 }}
              animate={{ y: pressed ? 5 : 0 }}
              transition={{ type: "spring", stiffness: 900, damping: 30 }}
              aria-label={`run job, +${clickValue} ops`}
              className={cn(
                "group relative flex h-32 w-full touch-manipulation select-none flex-col justify-between rounded-xl border border-white/10 bg-neutral-900 p-4 text-left",
                "shadow-[0_6px_0_0_rgb(38,38,38)] transition-colors hover:border-white/20 active:shadow-[0_1px_0_0_rgb(38,38,38)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary",
                pressed && "shadow-[0_1px_0_0_rgb(38,38,38)]",
              )}
            >
              <span className={cn(mono, "flex justify-between text-xs text-neutral-500")}>
                <span>run</span>
                <span className="hidden sm:inline">space / enter</span>
              </span>
              <span
                className={cn(
                  mono,
                  "text-3xl tabular-nums text-neutral-100 transition-colors group-active:text-primary",
                )}
              >
                +{format(clickValue)}
              </span>
            </motion.button>
            <AnimatePresence>
              {pops.map((p) => (
                <motion.span
                  key={p.id}
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -36 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    mono,
                    "pointer-events-none absolute -top-2 -translate-x-1/2 text-sm text-primary",
                  )}
                  style={{ left: `${p.x * 100}%` }}
                >
                  +{format(p.value)}
                </motion.span>
              ))}
            </AnimatePresence>
          </div>

          <Stats>
            <Stat label="per run" value={format(clickValue)} />
            <Stat label="this session" value={format(total)} />
          </Stats>
        </section>

        <section className="flex flex-col">
          <div className="mb-3 flex items-baseline justify-between">
            <h2 className="text-sm font-medium text-neutral-300">Automation</h2>
            <Choice
              options={AMOUNTS}
              value={amount}
              onChange={setAmount}
              format={(a) => (a === "max" ? "max" : `×${a}`)}
            />
          </div>
          <ul className="flex flex-col gap-2">
            {ITEMS.map((item, i) => {
              const count = owned[item.id] ?? 0;
              const q = quote(item, count, money, amount);
              const affordable = money >= q.cost;
              // tiers unlock one at a time
              const locked = i > 0 && !owned[ITEMS[i - 1]!.id] && !count;
              const progress = Math.min(1, money / q.cost);
              return (
                <li key={item.id}>
                  <button
                    disabled={!affordable}
                    onClick={() => buy(item)}
                    className={cn(
                      "flex w-full flex-col gap-3 rounded-lg border p-3 text-left transition-colors",
                      affordable
                        ? "border-white/15 hover:border-primary/60 active:bg-white/[0.03]"
                        : "cursor-not-allowed border-white/[0.06]",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex flex-col">
                        <span
                          className={cn(
                            "font-medium",
                            affordable ? "text-neutral-50" : "text-neutral-400",
                          )}
                        >
                          {locked ? "Locked" : item.name}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {locked
                            ? `buy a ${ITEMS[i - 1]!.name.toLowerCase()} first`
                            : `${item.note} · +${formatRate(item.perSecond)}/s`}
                        </span>
                      </div>
                      <div className={cn(mono, "flex flex-col items-end text-sm tabular-nums")}>
                        <span className={affordable ? "text-primary" : "text-neutral-500"}>
                          {format(q.cost)}
                        </span>
                        {q.count > 1 && (
                          <span className="text-xs text-neutral-500">×{q.count}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* one slot per unit owned, so you can see the farm grow */}
                      <div aria-hidden className="flex flex-1 gap-[3px]">
                        {Array.from({ length: SLOTS }, (_, s) => (
                          <span
                            key={s}
                            className={cn(
                              "h-2 flex-1 rounded-[1px]",
                              s < count ? "bg-primary/80" : "bg-white/[0.06]",
                            )}
                          />
                        ))}
                      </div>
                      <span
                        className={cn(
                          mono,
                          "w-10 text-right text-xs tabular-nums text-neutral-500",
                        )}
                      >
                        {count}
                      </span>
                    </div>

                    {/* how close you are to affording it; always takes space so rows don't jump */}
                    <div
                      aria-hidden
                      className={cn(
                        "h-px w-full bg-white/[0.06]",
                        (affordable || locked) && "invisible",
                      )}
                    >
                      <div
                        className="h-px bg-white/30 transition-[width] duration-300"
                        style={{ width: `${progress * 100}%` }}
                      />
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      </div>
      <footer className="text-xs text-neutral-600">
        Yes I know you can change every value in local storage
      </footer>
    </GameShell>
  );
}
