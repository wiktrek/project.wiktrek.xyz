import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useOs } from "../context";
import { apps } from "./apps";

const banner = `
██     ██ ██ ██   ██ ████████ ██████  ███████ ██   ██
██     ██ ██ ██  ██     ██    ██   ██ ██      ██  ██
██  █  ██ ██ █████      ██    ██████  █████   █████
██ ███ ██ ██ ██  ██     ██    ██   ██ ██      ██  ██
 ███ ███  ██ ██   ██    ██    ██   ██ ███████ ██   ██`;

const links: Record<string, string> = {
  website: "https://wiktrek.xyz",
  github: "https://github.com/wiktrek",
  blog: "https://wiktrek.xyz/blog",
  links: "https://link.wiktrek.xyz",
};

interface Line {
  prompt?: string;
  text: string;
}

export function Terminal() {
  const { open, dispatch } = useOs();
  const [lines, setLines] = useState<Line[]>([
    { text: "slopos terminal — type 'help' to get started" },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [lines]);

  function run(raw: string): string | null {
    const [cmd = "", ...args] = raw.trim().split(/\s+/);
    switch (cmd) {
      case "":
        return "";
      case "help":
        return [
          "help             show this message",
          "ls               list installed apps",
          "open <app>       launch an app",
          "echo <text>      print text",
          "whoami           who are you?",
          "date             current date and time",
          "neofetch         system information",
          "banner           print the banner",
          "website|github|blog|links   open a link",
          "clear            clear the screen",
          "exit             close the terminal",
        ].join("\n");
      case "ls":
        return apps.map((a) => a.id).join("  ");
      case "open": {
        const target = apps.find((a) => a.id === args[0]?.toLowerCase());
        if (!target) return `open: no such app '${args[0] ?? ""}'. Try 'ls'`;
        open(target.id);
        return `launching ${target.name}...`;
      }
      case "echo":
        return args.join(" ");
      case "whoami":
        return "guest";
      case "date":
        return new Date().toString();
      case "banner":
        return banner;
      case "neofetch":
        return [
          "guest@slopos",
          "---------------",
          "OS:      slopos 2.0",
          "Kernel:  react 19",
          "Shell:   wsh",
          `Apps:    ${apps.length}`,
          `Res:     ${window.innerWidth}x${window.innerHeight}`,
          `Uptime:  ${Math.floor(performance.now() / 60000)} min`,
        ].join("\n");
      case "clear":
        setLines([]);
        return null;
      case "exit":
        dispatch({ type: "close", id: "terminal" });
        return null;
      case "sudo":
        return "guest is not in the sudoers file. This incident will be reported.";
      default:
        if (links[cmd]) {
          window.open(links[cmd], "_blank");
          return `opening ${links[cmd]}`;
        }
        return `wsh: command not found: ${cmd}`;
    }
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      const output = run(input);
      if (output !== null) {
        setLines((l) => [
          ...l,
          { prompt: "guest@slopos ~ %", text: input },
          ...(output ? [{ text: output }] : []),
        ]);
      }
      if (input.trim()) setHistory((h) => [input, ...h]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp" || e.key === "ArrowDown") {
      e.preventDefault();
      const next =
        e.key === "ArrowUp"
          ? Math.min(historyIndex + 1, history.length - 1)
          : Math.max(historyIndex - 1, -1);
      setHistoryIndex(next);
      setInput(next === -1 ? "" : (history[next] ?? ""));
    }
  }

  return (
    <div
      className="text-text-300 min-h-full p-3 font-mono text-[13px] leading-relaxed"
      onClick={() => inputRef.current?.focus()}
    >
      {lines.map((line, i) => (
        <pre key={i} className="wrap-break-word whitespace-pre-wrap">
          {line.prompt && <span className="text-text-600">{line.prompt} </span>}
          {line.text}
        </pre>
      ))}
      <div ref={bottomRef} className="flex">
        <span className="text-text-600 mr-2 shrink-0">guest@slopos ~ %</span>
        <input
          ref={inputRef}
          autoFocus
          spellCheck={false}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          className="text-text-100 flex-1 bg-transparent caret-white outline-none"
        />
      </div>
    </div>
  );
}
