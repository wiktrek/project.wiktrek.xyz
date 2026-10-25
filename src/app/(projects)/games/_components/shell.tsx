import Link from "next/link";
import { cn } from "~/app/_components/lib/utils";

// numbers and small labels use Geist Mono, loaded in games/layout.tsx
export const mono = "font-(family-name:--font-geist-mono)";

export function GameShell({
  title,
  subtitle,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-5 pb-24 pt-4 sm:px-8">
      <header className="flex flex-col gap-4 border-b border-white/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Link
            href="/games"
            className={cn(
              mono,
              "w-fit text-xs text-neutral-500 transition-colors hover:text-primary",
            )}
          >
            ← games
          </Link>
          <h1 className="text-3xl font-semibold tracking-tight text-neutral-50 sm:text-4xl">
            {title}
          </h1>
          {subtitle && (
            <p className="max-w-prose text-pretty text-sm text-neutral-400">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        )}
      </header>
      <div className={cn("flex flex-col items-center gap-6", className)}>
        {children}
      </div>
    </main>
  );
}

export function Stats({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <dl className={cn("flex w-full flex-wrap gap-x-10 gap-y-3", className)}>
      {children}
    </dl>
  );
}

export function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-neutral-500">{label}</dt>
      <dd
        className={cn(
          mono,
          "text-xl tabular-nums",
          accent ? "text-primary" : "text-neutral-100",
        )}
      >
        {value}
      </dd>
    </div>
  );
}

export function GameButton({
  className,
  variant = "ghost",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost" | "solid";
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-3.5 py-1.5 text-sm transition-colors active:translate-y-px disabled:pointer-events-none disabled:opacity-40",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        variant === "solid"
          ? "bg-primary font-medium text-primary-foreground hover:bg-primary-200"
          : "border border-white/10 text-neutral-200 hover:border-white/25 hover:text-neutral-50",
        className,
      )}
      {...props}
    />
  );
}

/** A row of text options with the current one underlined, for modes and levels. */
export function Choice<T extends string | number>({
  options,
  value,
  onChange,
  format = String,
}: {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  format?: (value: T) => string;
}) {
  return (
    <div role="radiogroup" className={cn(mono, "flex gap-4 text-sm")}>
      {options.map((option) => (
        <button
          key={option}
          role="radio"
          aria-checked={option === value}
          onClick={() => onChange(option)}
          className={cn(
            "border-b pb-0.5 transition-colors",
            option === value
              ? "border-primary text-neutral-50"
              : "border-transparent text-neutral-500 hover:text-neutral-200",
          )}
        >
          {format(option)}
        </button>
      ))}
    </div>
  );
}

export function NewBest() {
  return <p className={cn(mono, "text-xs text-primary")}>new best</p>;
}

/** Shared look for start, pause and game over screens drawn over a board. */
export const overlay =
  "absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-neutral-950/85 p-6 text-center";
