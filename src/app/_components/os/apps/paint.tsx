import { Download, Eraser, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { PointerEvent } from "react";

const colors = [
  "#f5f5f5",
  "#f87171",
  "#fb923c",
  "#facc15",
  "#4ade80",
  "#38bdf8",
  "#a78bfa",
  "#f472b6",
];
const BG = "#171717";

export function Paint() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState(colors[1]!);
  const [size, setSize] = useState(6);
  const [eraser, setEraser] = useState(false);

  // Size the canvas to its container once; keeps drawings crisp.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    canvas.width = 1600;
    canvas.height = Math.round((1600 * rect.height) / rect.width) || 1000;
    clear();
  }, []);

  function clear() {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  function point(e: PointerEvent<HTMLCanvasElement>) {
    const canvas = e.currentTarget;
    const rect = canvas.getBoundingClientRect();
    return {
      x: ((e.clientX - rect.left) / rect.width) * canvas.width,
      y: ((e.clientY - rect.top) / rect.height) * canvas.height,
    };
  }

  function draw(e: PointerEvent<HTMLCanvasElement>) {
    if (!last.current) return;
    const ctx = e.currentTarget.getContext("2d");
    if (!ctx) return;
    const p = point(e);
    const scale = e.currentTarget.width / e.currentTarget.clientWidth;
    ctx.strokeStyle = eraser ? BG : color;
    ctx.lineWidth = size * scale * (eraser ? 3 : 1);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
  }

  function save() {
    const url = canvasRef.current?.toDataURL("image/png");
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = "painting.png";
    a.click();
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/5 px-3 py-2">
        <div className="flex gap-1.5">
          {colors.map((c) => (
            <button
              key={c}
              aria-label={c}
              onClick={() => {
                setColor(c);
                setEraser(false);
              }}
              style={{ background: c }}
              className={`ring-offset-background-900 h-6 w-6 rounded-full ring-offset-2 transition ${
                c === color && !eraser ? "ring-2 ring-white" : "hover:scale-110"
              }`}
            />
          ))}
        </div>
        <input
          type="range"
          min={1}
          max={30}
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="w-24 accent-white"
        />
        <div className="ml-auto flex gap-1">
          <ToolButton active={eraser} onClick={() => setEraser(!eraser)}>
            <Eraser className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={clear}>
            <Trash2 className="h-4 w-4" />
          </ToolButton>
          <ToolButton onClick={save}>
            <Download className="h-4 w-4" />
          </ToolButton>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        className="min-h-0 w-full flex-1 cursor-crosshair touch-none"
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          last.current = point(e);
          draw(e);
        }}
        onPointerMove={draw}
        onPointerUp={() => (last.current = null)}
      />
    </div>
  );
}

function ToolButton({
  children,
  onClick,
  active,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md p-1.5 transition ${active ? "bg-white/20" : "hover:bg-white/10"}`}
    >
      {children}
    </button>
  );
}
