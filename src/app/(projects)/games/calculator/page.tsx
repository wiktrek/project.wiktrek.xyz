"use client";
import { useEffect, useState } from "react";
import { Delete } from "lucide-react";
import { cn } from "~/app/_components/lib/utils";
import { GameShell, mono } from "../_components/shell";

type Op = "+" | "−" | "×" | "÷";

function apply(a: number, b: number, op: Op) {
  switch (op) {
    case "+":
      return a + b;
    case "−":
      return a - b;
    case "×":
      return a * b;
    case "÷":
      return a / b;
  }
}

function format(n: number) {
  if (!Number.isFinite(n)) return "Error";
  // avoid 0.1 + 0.2 = 0.30000000000000004
  const rounded = Number.parseFloat(n.toPrecision(12));
  return Math.abs(rounded) >= 1e12 ? rounded.toExponential(6) : String(rounded);
}

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  // the next digit replaces the display instead of appending
  const [fresh, setFresh] = useState(true);
  const [history, setHistory] = useState("");

  const error = display === "Error";

  function digit(d: string) {
    if (error || fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
      return;
    }
    if (d === "." && display.includes(".")) return;
    if (display.replace(/[-.]/g, "").length >= 12) return;
    setDisplay(display === "0" && d !== "." ? d : display + d);
  }

  function operator(next: Op) {
    if (error) return;
    const value = Number(display);
    if (prev !== null && op && !fresh) {
      const result = format(apply(prev, value, op));
      setDisplay(result);
      setPrev(Number(result));
    } else {
      setPrev(value);
    }
    setOp(next);
    setFresh(true);
    setHistory("");
  }

  function equals() {
    if (prev === null || !op || error) return;
    const value = Number(display);
    setHistory(`${format(prev)} ${op} ${format(value)} =`);
    setDisplay(format(apply(prev, value, op)));
    setPrev(null);
    setOp(null);
    setFresh(true);
  }

  function clear() {
    setDisplay("0");
    setPrev(null);
    setOp(null);
    setFresh(true);
    setHistory("");
  }

  function backspace() {
    if (fresh || error) return;
    setDisplay(
      display.length > 1 && display !== "-0" ? display.slice(0, -1) : "0",
    );
  }

  function negate() {
    if (error || display === "0") return;
    setDisplay(display.startsWith("-") ? display.slice(1) : `-${display}`);
  }

  function percent() {
    if (error) return;
    const value = Number(display);
    // 50 + 10% means 10% of 50, like a real calculator
    const base = prev !== null && (op === "+" || op === "−") ? prev : 1;
    setDisplay(format((value / 100) * base));
    setFresh(true);
  }

  // re-subscribed every render so the handlers always see current state
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const k = e.key;
      if (/^[0-9.]$/.test(k)) digit(k);
      else if (k === ",") digit(".");
      else if (k === "+") operator("+");
      else if (k === "-") operator("−");
      else if (k === "*" || k === "x") operator("×");
      else if (k === "/") operator("÷");
      else if (k === "Enter" || k === "=") equals();
      else if (k === "Backspace") backspace();
      else if (k === "Escape" || k === "Delete") clear();
      else if (k === "%") percent();
      else return;
      e.preventDefault();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const keys: {
    label: React.ReactNode;
    onClick: () => void;
    kind?: "fn" | "op" | "eq";
    active?: boolean;
    wide?: boolean;
  }[] = [
    {
      label: prev !== null || display !== "0" ? "C" : "AC",
      onClick: clear,
      kind: "fn",
    },
    { label: "±", onClick: negate, kind: "fn" },
    { label: "%", onClick: percent, kind: "fn" },
    {
      label: "÷",
      onClick: () => operator("÷"),
      kind: "op",
      active: op === "÷" && fresh,
    },
    ...["7", "8", "9"].map((d) => ({ label: d, onClick: () => digit(d) })),
    {
      label: "×",
      onClick: () => operator("×"),
      kind: "op",
      active: op === "×" && fresh,
    },
    ...["4", "5", "6"].map((d) => ({ label: d, onClick: () => digit(d) })),
    {
      label: "−",
      onClick: () => operator("−"),
      kind: "op",
      active: op === "−" && fresh,
    },
    ...["1", "2", "3"].map((d) => ({ label: d, onClick: () => digit(d) })),
    {
      label: "+",
      onClick: () => operator("+"),
      kind: "op",
      active: op === "+" && fresh,
    },
    { label: "0", onClick: () => digit("0"), wide: true },
    { label: ".", onClick: () => digit(".") },
    { label: "=", onClick: equals, kind: "eq" },
  ];

  const size =
    display.length > 11
      ? "text-3xl"
      : display.length > 8
        ? "text-4xl"
        : "text-5xl";

  return (
    <GameShell title="Calculator" subtitle="Keyboard works too.">
      <div className="w-full max-w-xs rounded-xl border border-white/10 bg-neutral-900 p-3">
        <div className="mb-3 flex h-28 flex-col items-end justify-end gap-1 overflow-hidden px-3 py-2">
          <span
            className={cn(
              mono,
              "h-5 truncate text-sm text-neutral-500 tabular-nums",
            )}
          >
            {history || (prev !== null && op ? `${format(prev)} ${op}` : "")}
          </span>
          <div className="flex w-full items-center justify-end gap-2">
            <button
              onClick={backspace}
              aria-label="backspace"
              className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-white/5 hover:text-neutral-200"
            >
              <Delete className="h-5 w-5" />
            </button>
            <span
              className={cn(
                mono,
                "truncate tracking-tight text-neutral-50 tabular-nums",
                size,
                error && "text-red-400",
              )}
            >
              {display}
            </span>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2">
          {keys.map((key, i) => (
            <button
              key={i}
              onClick={key.onClick}
              className={cn(
                mono,
                "h-14 rounded-lg text-xl transition-colors duration-100 active:translate-y-px",
                key.wide && "col-span-2",
                !key.kind &&
                  "bg-white/[0.05] text-neutral-100 hover:bg-white/[0.09]",
                key.kind === "fn" &&
                  "text-neutral-400 hover:bg-white/[0.05] hover:text-neutral-100",
                key.kind === "op" &&
                  (key.active
                    ? "bg-primary text-primary-foreground"
                    : "text-primary hover:bg-white/[0.05]"),
                key.kind === "eq" &&
                  "bg-primary text-primary-foreground hover:bg-primary-200",
              )}
            >
              {key.label}
            </button>
          ))}
        </div>
      </div>
    </GameShell>
  );
}
