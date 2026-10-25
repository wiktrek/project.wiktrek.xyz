import Link from "next/link";
import type { Metadata } from "next";
import { cn } from "~/app/_components/lib/utils";
import { mono } from "./_components/shell";
import { BestLabel } from "./_components/best-label";

export const metadata: Metadata = {
  title: "Games - wiktrek.xyz",
  description: "Small browser games",
};

const games: {
  href: string;
  name: string;
  best?: { key: string; unit?: string };
}[] = [
  { href: "/games/blocks", name: "Blocks", best: { key: "blocks" } },
  { href: "/games/snake", name: "Snake", best: { key: "snake" } },
  {
    href: "/games/minesweeper",
    name: "Minesweeper",
    best: { key: "minesweeper-easy", unit: "s" },
  },
  { href: "/games/aim", name: "Aim", best: { key: "aim" } },
  {
    href: "/games/typing",
    name: "Typing",
    best: { key: "typing-30", unit: " wpm" },
  },
  { href: "/games/clicker", name: "Clicker" },
  { href: "/games/gol", name: "Game of Life" },
  { href: "/games/calculator", name: "Calculator" },
];

export default function Page() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-8 px-5 pt-4 pb-24 sm:px-8">
      <h1 className="text-4xl font-semibold tracking-tight text-neutral-50">
        Games
      </h1>
      <h2>Semi AI slop games</h2>
      <ul className="border-t border-white/10">
        {games.map((game) => (
          <li key={game.href} className="border-b border-white/10">
            <Link
              href={game.href}
              className="group flex items-baseline justify-between gap-4 py-4"
            >
              <span className="group-hover:text-primary text-lg text-neutral-100 transition-colors">
                {game.name}
              </span>
              {game.best && (
                <span className={cn(mono, "text-xs text-neutral-500")}>
                  <BestLabel storageKey={game.best.key} unit={game.best.unit} />
                </span>
              )}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
