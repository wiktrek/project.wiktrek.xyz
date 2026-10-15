import { Minus, Square, X } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import type { WindowState } from "../lib/os";
import type { AppDefinition } from "./apps/apps";
import { useOs } from "./context";

const MIN_W = 260;
const MIN_H = 180;

export function Window({
  win,
  app,
  focused,
}: {
  win: WindowState;
  app: AppDefinition;
  focused: boolean;
}) {
  const { dispatch } = useOs();
  const ref = useRef<HTMLDivElement>(null);

  // Shared pointer-drag helper for moving and resizing.
  function drag(
    e: ReactPointerEvent,
    onMove: (dx: number, dy: number) => void,
  ) {
    if (e.button !== 0) return;
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const move = (ev: PointerEvent) =>
      onMove(ev.clientX - startX, ev.clientY - startY);
    const up = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  function startMove(e: ReactPointerEvent) {
    if (win.maximized) return;
    const parent = ref.current?.parentElement;
    const maxX = (parent?.clientWidth ?? 1000) - 80;
    const maxY = (parent?.clientHeight ?? 800) - 40;
    drag(e, (dx, dy) =>
      dispatch({
        type: "move",
        id: win.id,
        x: Math.min(Math.max(win.x + dx, -win.w + 80), maxX),
        y: Math.min(Math.max(win.y + dy, 0), maxY),
      }),
    );
  }

  function startResize(e: ReactPointerEvent) {
    e.stopPropagation();
    drag(e, (dx, dy) =>
      dispatch({
        type: "resize",
        id: win.id,
        w: Math.max(MIN_W, win.w + dx),
        h: Math.max(MIN_H, win.h + dy),
      }),
    );
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 6 }}
      animate={win.minimized ? { opacity: 0, y: 12 } : { opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 6 }}
      transition={{ duration: 0.14, ease: "easeOut" }}
      onPointerDown={() => dispatch({ type: "focus", id: win.id })}
      style={
        win.maximized
          ? { left: 0, top: 0, width: "100%", height: "100%", zIndex: win.z }
          : {
              left: win.x,
              top: win.y,
              width: win.w,
              height: win.h,
              zIndex: win.z,
            }
      }
      className={`text-text-100 absolute flex flex-col overflow-hidden border bg-[#161616] ${
        win.minimized ? "pointer-events-none" : ""
      } ${win.maximized ? "rounded-none border-0" : "rounded-md"} ${
        focused
          ? "border-white/20 shadow-[0_16px_48px_-12px_rgba(0,0,0,0.7)]"
          : "border-white/[0.07]"
      }`}
    >
      <div
        onPointerDown={startMove}
        onDoubleClick={() => dispatch({ type: "toggleMaximize", id: win.id })}
        className="flex h-8 shrink-0 cursor-default items-center justify-between pl-3 select-none"
      >
        <span
          className={`text-xs tracking-wide lowercase ${focused ? "text-text-200" : "text-text-600"}`}
        >
          {app.name}
        </span>
        <div className="flex h-full" onPointerDown={(e) => e.stopPropagation()}>
          <TitleButton
            label="Minimize"
            onClick={() => dispatch({ type: "minimize", id: win.id })}
          >
            <Minus className="h-3.5 w-3.5" />
          </TitleButton>
          <TitleButton
            label="Maximize"
            onClick={() => dispatch({ type: "toggleMaximize", id: win.id })}
          >
            <Square className="h-3 w-3" />
          </TitleButton>
          <TitleButton
            label="Close"
            danger
            onClick={() => dispatch({ type: "close", id: win.id })}
          >
            <X className="h-3.5 w-3.5" />
          </TitleButton>
        </div>
      </div>
      <div className="relative min-h-0 flex-1 scrollbar-thin scrollbar-thumb-white/10 overflow-auto border-t border-white/[0.06]">
        <app.component />
      </div>
      {!win.maximized && (
        <div
          onPointerDown={startResize}
          className="absolute right-0 bottom-0 h-4 w-4 cursor-nwse-resize"
        />
      )}
    </motion.div>
  );
}

function TitleButton({
  children,
  label,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={`text-text-500 flex w-10 items-center justify-center transition-colors hover:text-white ${
        danger ? "hover:bg-red-500/80" : "hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
