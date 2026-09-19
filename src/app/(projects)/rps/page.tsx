"use client";
import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

type Choice = "rock" | "paper" | "scissors";
const choices: Choice[] = ["rock", "paper", "scissors"];

const Home: NextPage = () => {
  const [rpc, setRpc] = useState<Choice | "">("");
  const [rpc2, setRpc2] = useState<Choice | "">("");
  const [result, setResult] = useState("");
  const [pick, setPick] = useState("");
  function checkwin(choice: Choice) {
    const computerChoice = choices[Math.floor(Math.random() * choices.length)]!;
    setRpc(choice);
    setRpc2(computerChoice);
    setPick(computerChoice);
    if (choice === computerChoice) return setResult("Tie");
    const wins =
      (choice === "rock" && computerChoice === "scissors") ||
      (choice === "paper" && computerChoice === "rock") ||
      (choice === "scissors" && computerChoice === "paper");
    setResult(wins ? "You won" : "You lost");
  }

  return (
    <>
      <Head>
        <title>Rock paper scissors - wiktrek</title>
        <meta name="description" content="Rock paper scissors" />
      </Head>
      <div className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl">
        <div className="">
          <button className="h-8 w-16 rounded bg-slate-500" onClick={() => checkwin("rock")}>
            rock
          </button>
          <button className="h-8 w-16 rounded bg-slate-500" onClick={() => checkwin("paper")}>
            paper
          </button>
          <button className="h-8 w-16 rounded bg-slate-500" onClick={() => checkwin("scissors")}>
            scissors
          </button>
        </div>
        <p>
          {result}: server picked {pick}
        </p>
      </div>
    </>
  );
};

export default Home;
