"use client";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { cn } from "~/app/_components/lib/utils";
import {
  Choice,
  GameButton,
  GameShell,
  NewBest,
  Stat,
  Stats,
  mono,
} from "../_components/shell";
import { useBest } from "../_components/use-best";

const WORDS =
  "the be of and a to in he have it that for they with as not on she at by this we you do but from or which one would all will there say who make when can more if no man out other so what time up go about than into could state only new year some take come these know see use get like then first any work now may such give over think most even find day also after way many must look before great back through long where much should well people down own just because good each those feel seem how high too place little world very still nation hand old life tell write become here show house both between need mean call develop under last right move thing general school never same another begin while number part turn real leave might want point form off child few small since against ask late home interest large person end open public follow during present without again hold govern around possible head consider word program problem however lead system set order eye plan run keep face fact group play stand increase early course change help line".split(
    " ",
  );
const MODES = [15, 30, 60] as const;
type Mode = (typeof MODES)[number];

function randomWords(n: number) {
  return Array.from(
    { length: n },
    () => WORDS[Math.floor(Math.random() * WORDS.length)]!,
  );
}

export default function TypingGame() {
  const inputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLSpanElement>(null);

  const [mode, setMode] = useState<Mode>(30);
  const [words, setWords] = useState<string[]>([]);
  const [typed, setTyped] = useState<string[]>([""]);
  const [keystrokes, setKeystrokes] = useState({ good: 0, total: 0 });
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [now, setNow] = useState(0);
  const [done, setDone] = useState(false);
  const [focused, setFocused] = useState(true);
  const [offset, setOffset] = useState(0);
  const [newBest, setNewBest] = useState(false);
  const [best, submitBest] = useBest(`typing-${mode}`);

  const index = typed.length - 1;

  function reset(nextMode = mode) {
    setMode(nextMode);
    setWords(randomWords(120));
    setTyped([""]);
    setKeystrokes({ good: 0, total: 0 });
    setStartedAt(null);
    setDone(false);
    setNewBest(false);
    setOffset(0);
    inputRef.current?.focus();
  }

  // generated on the client so server and browser render match
  useEffect(() => reset(), []); // eslint-disable-line react-hooks/exhaustive-deps

  const elapsed = startedAt ? Math.min(mode, (now - startedAt) / 1000) : 0;
  const timeLeft = Math.ceil(mode - elapsed);

  // chars of fully correct words plus their spaces, the standard WPM measure
  const correctChars = typed.reduce((sum, t, i) => {
    if (i === index) return sum + (words[i]?.startsWith(t) ? t.length : 0);
    return sum + (t === words[i] ? t.length + 1 : 0);
  }, 0);
  const wpm = elapsed > 1 ? Math.round(correctChars / 5 / (elapsed / 60)) : 0;
  const accuracy = keystrokes.total
    ? Math.round((keystrokes.good / keystrokes.total) * 100)
    : 100;

  useEffect(() => {
    if (!startedAt || done) return;
    const interval = setInterval(() => {
      const t = performance.now();
      setNow(t);
      if (t - startedAt >= mode * 1000) setDone(true);
    }, 100);
    return () => clearInterval(interval);
  }, [startedAt, done, mode]);

  useEffect(() => {
    if (done) setNewBest(submitBest(wpm));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [done]);

  // keep the active word on the second visible line
  useLayoutEffect(() => {
    const el = activeRef.current;
    if (!el) return;
    const line = el.offsetHeight;
    setOffset(Math.max(0, el.offsetTop - line));
  }, [index, words]);

  /**
   * The input's value mirrors the current word, and every change is diffed
   * against it. Reading the value instead of keydown events makes mobile
   * keyboards, IMEs and autocorrect work too.
   */
  function onChange(value: string) {
    if (done || !words.length) return;
    if (!startedAt && value.trim()) {
      const t = performance.now();
      setStartedAt(t);
      setNow(t);
    }
    const next = [...typed];
    let { good, total } = keystrokes;
    const parts = value.split(" ");
    parts.forEach((part, pi) => {
      const i = next.length - 1;
      const word = words[i] ?? "";
      const current = next[i]!;
      if (part.length > current.length && part.startsWith(current)) {
        for (let c = current.length; c < part.length; c++) {
          total++;
          if (word[c] === part[c]) good++;
        }
      }
      next[i] = part.slice(0, word.length + 8);
      // every part except the last one was followed by a space
      if (pi < parts.length - 1 && next[i]) {
        total++;
        if (next[i] === word) good++;
        next.push("");
      }
    });
    setTyped(next);
    setKeystrokes({ good, total });
    if (next.length > words.length - 40)
      setWords((w) => [...w, ...randomWords(60)]);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    // editing mid-word would break the diffing, so the caret stays at the end
    if (
      [
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "Home",
        "End",
      ].includes(e.key)
    ) {
      e.preventDefault();
      return;
    }
    // backspace on an empty word goes back, but only to fix a wrong word
    if (
      e.key === "Backspace" &&
      !typed[index] &&
      index > 0 &&
      typed[index - 1] !== words[index - 1]
    ) {
      e.preventDefault();
      setTyped(typed.slice(0, -1));
    }
  }

  // Tab restarts from anywhere, other keys pull focus back to the input
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Tab") {
        e.preventDefault();
        reset();
        return;
      }
      const input = inputRef.current;
      if (!input || document.activeElement === input) return;
      if (e.metaKey || e.ctrlKey || e.altKey || e.key.length !== 1) return;
      if (document.activeElement instanceof HTMLInputElement) return;
      input.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    setFocused(document.activeElement === inputRef.current);
  }, [done]);

  return (
    <GameShell
      title="Typing"
      subtitle="The timer starts when you start typing. Tab restarts."
      actions={
        <Choice
          options={MODES}
          value={mode}
          onChange={(m) => reset(m)}
          format={(m) => `${m}s`}
        />
      }
    >
      <Stats>
        <Stat label="time" value={startedAt ? timeLeft : mode} />
        <Stat label="wpm" value={wpm} accent />
        <Stat label="accuracy" value={`${accuracy}%`} />
        <Stat label={`best ${mode}s`} value={best ?? "–"} />
      </Stats>

      {done ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex w-full flex-col items-start gap-3 py-6"
        >
          {newBest && <NewBest />}
          <p className={cn(mono, "text-7xl text-neutral-50 tabular-nums")}>
            {wpm}
            <span className="ml-3 text-xl text-neutral-500">wpm</span>
          </p>
          <p className="text-sm text-neutral-400">
            {accuracy}% accuracy, {index} words in {mode}s
          </p>
          <GameButton variant="solid" onClick={() => reset()} className="mt-3">
            Try again
          </GameButton>
        </motion.div>
      ) : (
        <div className="relative w-full py-2">
          {/* invisible input over the text, so tapping it opens mobile keyboards */}
          <input
            ref={inputRef}
            autoFocus
            value={typed[index] ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoCapitalize="off"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            enterKeyHint="next"
            className="absolute inset-0 z-10 h-full w-full cursor-text text-base opacity-0"
            aria-label="typing input"
          />
          <div
            className={cn(
              mono,
              "h-[7.5rem] overflow-hidden text-2xl leading-[2.5rem] transition-[filter] sm:text-[1.65rem]",
              !focused && "blur-sm",
            )}
          >
            <div
              className="relative flex flex-wrap gap-x-[0.6em] transition-transform duration-200"
              style={{ transform: `translateY(-${offset}px)` }}
            >
              {words.map((word, i) => (
                <Word
                  key={i}
                  ref={i === index ? activeRef : undefined}
                  word={word}
                  typed={typed[i]}
                  active={i === index && focused}
                  past={i < index}
                />
              ))}
            </div>
          </div>
          {!focused && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-neutral-300">
              click here or start typing
            </div>
          )}
        </div>
      )}
    </GameShell>
  );
}

function Word({
  word,
  typed,
  active,
  past,
  ref,
}: {
  word: string;
  typed: string | undefined;
  active: boolean;
  past: boolean;
  ref?: React.Ref<HTMLSpanElement>;
}) {
  const t = typed ?? "";
  const extra = t.slice(word.length);
  const wrong = past && t !== word;
  return (
    <span
      ref={ref}
      className={cn(
        "relative whitespace-nowrap",
        wrong &&
          "underline decoration-red-400/60 decoration-1 underline-offset-[6px]",
      )}
    >
      {word.split("").map((ch, i) => (
        <span
          key={i}
          className={cn(
            "relative",
            i >= t.length
              ? "text-neutral-600"
              : t[i] === ch
                ? "text-neutral-100"
                : "text-red-400",
          )}
        >
          {active && i === t.length && <Caret />}
          {ch}
        </span>
      ))}
      {extra.split("").map((ch, i) => (
        <span key={`x${i}`} className="text-red-400/50">
          {ch}
        </span>
      ))}
      {active && t.length >= word.length && (
        <span className="relative">
          <Caret />
        </span>
      )}
    </span>
  );
}

function Caret() {
  return (
    <motion.span
      layoutId="caret"
      transition={{ type: "spring", stiffness: 900, damping: 50 }}
      className="bg-primary absolute top-1.5 bottom-1.5 -left-px w-0.5"
    />
  );
}
