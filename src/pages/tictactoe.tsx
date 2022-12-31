import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";
import checkwin from "./functions/checkwin";
const Home: NextPage = () => {
  // ⭕
  const [pick, setpick] = useState("❌");
  const [one, setone] = useState("");
  const [two, settwo] = useState("");
  const [three, setthree] = useState("");
  const [four, setfour] = useState("");
  const [five, setfive] = useState("");
  const [six, setsix] = useState("");
  const [seven, setseven] = useState("");
  const [eight, seteight] = useState("");
  const [nine, setnine] = useState("");
  const [win, setwin] = useState({ text: "", won: false });
  function Click(e: React.MouseEvent<HTMLButtonElement>) {
    if (win.won === true) return;
    const id = (e.target as HTMLElement).id;
    console.log(id);
    let a = 0;
    if (id === "one" && one === "") {
      a = 1;
      setone(pick);
    }
    if (id === "two" && two === "") {
      a = 1;
      settwo(pick);
    }
    if (id === "three" && three === "") {
      a = 1;
      setthree(pick);
    }
    if (id === "four" && four === "") {
      a = 1;
      setfour(pick);
    }
    if (id === "five" && five === "") {
      a = 1;
      setfive(pick);
    }
    if (id === "six" && six === "") {
      a = 1;
      setsix(pick);
    }
    if (id === "seven" && seven === "") {
      a = 1;
      setseven(pick);
    }
    if (id === "eight" && eight === "") {
      a = 1;
      seteight(pick);
    }
    if (id === "nine" && nine === "") {
      a = 1;
      setnine(pick);
    }

    if (a === 0) return;

    if (pick === "❌") return setpick("⭕");
    if (pick === "⭕") return setpick("❌");
  }
  function check() {
    clearInterval(interval);
    if (win.text !== "") {
      return setwin({ text: win.text, won: true });
    }
    setwin({
      text: `${checkwin(one, two, three, four, five, six, seven, eight, nine)}`,
      won: false,
    });
  }

  const interval = setInterval(check, 400);

  return (
    <>
      <Head>
        <title>tictactoe - wiktrek.xyz</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen w-screen bg-[url('/bg.png')] ">
        <div className="mx-auto flex h-screen w-screen flex-col items-center justify-center ">
          <div className="grid grid-cols-3">
            <button className="ttt" onClick={Click} id="one">
              {one}
            </button>
            <button className="ttt" onClick={Click} id="two">
              {two}
            </button>
            <button className="ttt" onClick={Click} id="three">
              {three}
            </button>
            <button className="ttt" onClick={Click} id="four">
              {four}
            </button>
            <button className="ttt" onClick={Click} id="five">
              {five}
            </button>
            <button className="ttt" onClick={Click} id="six">
              {six}
            </button>
            <button className="ttt" onClick={Click} id="seven">
              {seven}
            </button>
            <button className="ttt" onClick={Click} id="eight">
              {eight}
            </button>
            <button className="ttt" onClick={Click} id="nine">
              {nine}
            </button>
          </div>
          <a className="text-white">{win.text}</a>
        </div>
      </main>
    </>
  );
};

export default Home;
