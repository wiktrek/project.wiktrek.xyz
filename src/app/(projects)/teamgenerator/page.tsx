"use client";

import { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Page: NextPage = () => {
  const [result, setResult] = useState([] as string[][]);
  const [textarea, setTextarea] = useState("");
  const [size, setSize] = useState(2);
  function Randomize() {
    let teammates = textarea.split("\n");
    shuffle(teammates);

    setResult(split_into_chunks(teammates, size));
  }
  return (
    <>
      <Head>
        <title>Team generator - wiktrek.xyz</title>
      </Head>
      <main className="top-16 flex flex-col items-center justify-center text-center">
        <textarea
          className="h-72 w-56 resize-none rounded-xl border-2 border-border p-2"
          placeholder={`Wiktrek \nMe`}
          id="textarea"
          onChange={(e) => setTextarea(e.target.value)}
          value={textarea}
        ></textarea>
        <label>Team amount</label>
        <input
          type="number"
          className="w-16 rounded-md border-2 border-border text-center [appearance:textfield] active:border-border [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          defaultValue={2}
          onChange={(e) => setSize(Number(e.target.value))}
          value={size}
        />
        <button className="text-2xl font-semibold" onClick={Randomize}>
          Randomize!
        </button>
        <p>
          {result.map((team, i) => {
            return (
              <div key={i}>
                <p>Team {i + 1}</p>
                <ul>
                  {team.map((member) => {
                    return <li key={member}>{member}</li>;
                  })}
                </ul>
              </div>
            );
          })}
        </p>
      </main>
    </>
  );
};

export default Page;
function split_into_chunks(array: string[], amount: number): string[][] {
  let split_arr: string[][] = [];
  console.log("e", array);
  let arr = [];
  for (let i = 0; i < array.length; i++) {
    arr.push(array[i]!);
    if ((i + 1) % amount === 0) {
      split_arr.push(arr);
      arr = [];
    }
    if (i === array.length - 1) {
      split_arr.push(arr);
    }
  }
  return split_arr;
}
function range(start: number, end: number): number[] {
  let numbers = [];
  for (let i = start; i < end; i++) {
    numbers.push(i);
  }
  return numbers;
}
function shuffle(array: string[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex]!,
      array[currentIndex]!,
    ];
  }
}
