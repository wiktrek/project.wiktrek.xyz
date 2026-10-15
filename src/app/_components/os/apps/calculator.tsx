import { useState } from "react";

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
      return b === 0 ? NaN : a / b;
  }
}

function format(n: number) {
  if (!Number.isFinite(n)) return "Error";
  return String(parseFloat(n.toPrecision(12)));
}

export function Calculator() {
  const [display, setDisplay] = useState("0");
  const [stored, setStored] = useState<number | null>(null);
  const [op, setOp] = useState<Op | null>(null);
  const [fresh, setFresh] = useState(true);

  function digit(d: string) {
    if (fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
    } else if (!(d === "." && display.includes("."))) {
      setDisplay(display === "0" && d !== "." ? d : display + d);
    }
  }

  function operator(next: Op) {
    const value = parseFloat(display);
    if (stored !== null && op && !fresh) {
      const result = apply(stored, value, op);
      setStored(result);
      setDisplay(format(result));
    } else {
      setStored(value);
    }
    setOp(next);
    setFresh(true);
  }

  function equals() {
    if (stored === null || !op) return;
    setDisplay(format(apply(stored, parseFloat(display), op)));
    setStored(null);
    setOp(null);
    setFresh(true);
  }

  function clear() {
    setDisplay("0");
    setStored(null);
    setOp(null);
    setFresh(true);
  }

  const keys: { label: string; onClick: () => void; style?: string }[] = [
    { label: "AC", onClick: clear, style: "fn" },
    {
      label: "±",
      onClick: () => setDisplay(format(-parseFloat(display))),
      style: "fn",
    },
    {
      label: "%",
      onClick: () => setDisplay(format(parseFloat(display) / 100)),
      style: "fn",
    },
    { label: "÷", onClick: () => operator("÷"), style: "op" },
    ...["7", "8", "9"].map((d) => ({ label: d, onClick: () => digit(d) })),
    { label: "×", onClick: () => operator("×"), style: "op" },
    ...["4", "5", "6"].map((d) => ({ label: d, onClick: () => digit(d) })),
    { label: "−", onClick: () => operator("−"), style: "op" },
    ...["1", "2", "3"].map((d) => ({ label: d, onClick: () => digit(d) })),
    { label: "+", onClick: () => operator("+"), style: "op" },
    { label: "0", onClick: () => digit("0"), style: "wide" },
    { label: ".", onClick: () => digit(".") },
    { label: "=", onClick: equals, style: "op" },
  ];

  return (
    <div className="flex h-full flex-col p-3">
      <div className="flex flex-1 items-end justify-end overflow-hidden px-2 pb-3 text-5xl font-thin tabular-nums">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {keys.map((k) => (
          <button
            key={k.label}
            onClick={k.onClick}
            className={`h-12 rounded text-lg transition-colors ${
              k.style === "op"
                ? k.label === op && fresh
                  ? "bg-white text-black"
                  : "border border-white/20 hover:bg-white/10"
                : k.style === "fn"
                  ? "text-text-400 hover:bg-white/10"
                  : "bg-white/[0.04] hover:bg-white/10"
            } ${k.style === "wide" ? "col-span-2 pl-6 text-left" : ""}`}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
