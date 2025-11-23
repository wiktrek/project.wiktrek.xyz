"use client";

import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Page: NextPage = () => {
  const [result, setResult] = useState([] as string[][]);
  const [textarea, setTextarea] = useState("");
  const [size, setSize] = useState(2);
  function Randomize() {
    const teammates = textarea
      .split("\n")
      .filter((teammate) => teammate.trim().length !== 0);
    shuffle(teammates);
    setResult([]);
    setResult(split_into_chunks(teammates, size));
  }
  return (
    <>
      <main className="top-16 flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-semibold">Generate random teams</h1>
        <textarea
          className="h-72 w-64 resize-none rounded-xl border-2 border-border p-2"
          placeholder={`wiktrek\nwiktrek2`}
          id="textarea"
          onChange={(e) => setTextarea(e.target.value)}
          value={textarea}
        ></textarea>
        <div>
        <label className="text-2xl">Team amount: </label>
        <input
          type="number"
          className="w-16 rounded-md border-2 border-border text-center [appearance:textfield] active:border-border [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          onChange={(e) => setSize(Number(e.target.value))}
          value={size}
        />
        </div>
        <button className="text-2xl font-semibold" onClick={Randomize}>
          Randomize!
        </button>
        <ResultComponent result={result} />
      </main>
    </>
  );
};
const ResultComponent = ({ result }: { result: string[][] }) => {
  return (
    <div>
      {result.map((team, i) => {
        return (
          <div key={"team " + i}>
            <p className="text-2xl text-primary">Team {i + 1}</p>
            <ul className="text-base">
              {team.map((member,j) => {
                return <li key={`${i}.${j}.${member}`}>{member}</li>;
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
export default Page;
function split_into_chunks(array: string[], amount: number): string[][] {
  console.log(array);
  const d = Math.ceil(array.length / amount); // amount of teammates in a team
  const split_arr: string[][] = [];
  for (let i = 0;i<amount;i++) {
    for (let j =0;j<d;j++) {
      if (j == 0) {
        split_arr.push([array[i*d+j]!])
      } else {
        split_arr[i]!.push(array[i*d+j]!);
      }
    }
  }
  return split_arr;
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
