import {
  Bomb,
  BookOpen,
  Calculator as CalculatorIcon,
  Gamepad2,
  Globe,
  Grid3x3,
  Info,
  Paintbrush,
  Settings as SettingsIcon,
  StickyNote,
  Terminal as TerminalIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";
import { About } from "./about";
import { BlogApp } from "./blog";
import { Browser } from "./browser";
import { Calculator } from "./calculator";
import { Minesweeper } from "./minesweeper";
import { Notes } from "./notes";
import { Paint } from "./paint";
import { Settings } from "./settings";
import { Snake } from "./snake";
import { Terminal } from "./terminal";
import { TicTacToe } from "./ttt";

export interface AppDefinition {
  id: string;
  name: string;
  icon: LucideIcon;
  component: ComponentType;
  w: number;
  h: number;
}

export const apps: AppDefinition[] = [
  {
    id: "terminal",
    name: "Terminal",
    icon: TerminalIcon,
    component: Terminal,
    w: 620,
    h: 400,
  },
  {
    id: "browser",
    name: "Browser",
    icon: Globe,
    component: Browser,
    w: 860,
    h: 560,
  },
  {
    id: "notes",
    name: "Notes",
    icon: StickyNote,
    component: Notes,
    w: 420,
    h: 420,
  },
  {
    id: "calculator",
    name: "Calculator",
    icon: CalculatorIcon,
    component: Calculator,
    w: 280,
    h: 440,
  },
  {
    id: "paint",
    name: "Paint",
    icon: Paintbrush,
    component: Paint,
    w: 640,
    h: 480,
  },
  {
    id: "blog",
    name: "Blog",
    icon: BookOpen,
    component: BlogApp,
    w: 520,
    h: 460,
  },
  {
    id: "snake",
    name: "Snake",
    icon: Gamepad2,
    component: Snake,
    w: 420,
    h: 500,
  },
  {
    id: "minesweeper",
    name: "Minesweeper",
    icon: Bomb,
    component: Minesweeper,
    w: 360,
    h: 470,
  },
  {
    id: "tictactoe",
    name: "Tic Tac Toe",
    icon: Grid3x3,
    component: TicTacToe,
    w: 320,
    h: 400,
  },
  {
    id: "settings",
    name: "Settings",
    icon: SettingsIcon,
    component: Settings,
    w: 480,
    h: 380,
  },
  {
    id: "about",
    name: "About",
    icon: Info,
    component: About,
    w: 520,
    h: 320,
  },
];

export const appsById = Object.fromEntries(apps.map((a) => [a.id, a]));

export function AppIcon({
  app,
  className = "h-10 w-10",
}: {
  app: AppDefinition;
  className?: string;
}) {
  const Icon = app.icon;
  return (
    <div
      className={`text-text-200 flex items-center justify-center rounded-md border border-white/10 bg-white/[0.03] ${className}`}
    >
      <Icon className="h-1/2 w-1/2" strokeWidth={1.5} />
    </div>
  );
}
