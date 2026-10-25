"use client";

import type { NextPage } from "next";
import { useState } from "react";

const Page: NextPage = () => {
  const [result, setResult] = useState([] as string[][]);
  const [textarea, setTextarea] = useState("");
  const [size, setSize] = useState(2);
  const [error, setError] = useState("");
  function Randomize() {
    const teammates = textarea
      .split("\n")
      .filter((teammate) => teammate.trim().length !== 0);
    if (size < 1 || size > teammates.length) {
      setError(`Team amount must be between 1 and ${teammates.length}.`);
      return;
    }
    setError("");
    shuffle(teammates);
    setResult([]);
    setResult(split_into_chunks(teammates, size));
  }
  return (
    <>
      <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 py-12 sm:px-6">
        <div className="mb-8 max-w-2xl">
          <p className="text-primary mb-3 text-xs font-semibold tracking-[0.2em] uppercase">
            Small tool / group shuffle
          </p>
          <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
            Generate random teams
          </h1>
          <p className="text-muted-foreground mt-3 max-w-xl text-base">
            Add one person per line, choose how many teams you need, and let the
            shuffle do the awkward part.
          </p>
        </div>
        <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_220px]">
          <div className="rounded-2xl border border-white/8 bg-white/[0.035] p-5 shadow-[0_20px_60px_-36px_rgba(0,0,0,0.9)] sm:p-6">
            <label
              htmlFor="textarea"
              className="mb-2 block text-sm font-medium"
            >
              People
            </label>
            <textarea
              className="bg-background/70 focus:border-primary/60 focus:ring-primary/20 h-72 w-full resize-none rounded-xl border border-white/10 p-3 text-sm transition outline-none placeholder:text-white/25 focus:ring-2"
              placeholder={`Alex\nSam\nTaylor\nJordan`}
              id="textarea"
              onChange={(e) => setTextarea(e.target.value)}
              value={textarea}
            ></textarea>
          </div>
          <div className="flex flex-col rounded-2xl border border-white/8 bg-white/[0.035] p-5 sm:p-6">
            <label htmlFor="team-amount" className="text-sm font-medium">
              Number of teams
            </label>
            <input
              id="team-amount"
              type="number"
              className="bg-background/70 focus:border-primary/60 focus:ring-primary/20 mt-2 w-full [appearance:textfield] rounded-xl border border-white/10 px-3 py-2.5 text-center text-lg transition outline-none focus:ring-2 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
              onChange={(e) => setSize(Number(e.target.value))}
              value={size}
            />
            <button
              className="bg-primary text-primary-foreground hover:bg-primary/90 mt-auto rounded-xl px-4 py-3 text-sm font-semibold transition active:scale-[0.98]"
              onClick={Randomize}
            >
              Shuffle teams
            </button>
            {error && (
              <p className="text-destructive mt-3 text-sm" role="alert">
                {error}
              </p>
            )}
          </div>
        </section>
        <ResultComponent result={result} />
      </main>
    </>
  );
};
const ResultComponent = ({ result }: { result: string[][] }) => {
  return (
    <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {result.map((team, i) => {
        return (
          <div
            key={"team " + i}
            className="rounded-2xl border border-white/8 bg-white/[0.035] p-5"
          >
            <p className="text-primary mb-3 text-sm font-semibold tracking-wide uppercase">
              Team {i + 1}
            </p>
            <ul className="space-y-2 text-sm">
              {team.map((member, j) => {
                return (
                  <li
                    className="border-b border-white/8 pb-2 last:border-0 last:pb-0"
                    key={`${i}.${j}.${member}`}
                  >
                    {member}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </section>
  );
};
export default Page;
function split_into_chunks(array: string[], amount: number): string[][] {
  const teams = Array.from({ length: amount }, () => [] as string[]);
  array.forEach((member, index) => teams[index % amount]!.push(member));
  return teams;
}
function shuffle(array: string[]) {
  let currentIndex = array.length;
  while (currentIndex != 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex]!,
      array[currentIndex]!,
    ];
  }
}
