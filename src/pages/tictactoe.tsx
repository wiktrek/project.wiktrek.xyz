import type { NextPage } from "next";
import Head from "next/head";
import { useState } from "react";

const Home: NextPage = () => {
  const [one, setone] = useState("");
  const [two, settwo] = useState("");
  const [three, setthree] = useState("");
  const [four, setfour] = useState("");
  const [five, setfive] = useState("");
  const [six, setsix] = useState("");
  const [seven, setseven] = useState("");
  const [eight, seteight] = useState("");
  const [nine, setnine] = useState("");
  function Click(e: React.MouseEvent<HTMLButtonElement>) {
    const id = (e.target as HTMLElement).id;
    console.log(id);
  }
  return (
    <>
      <Head>
        <title>tictactoe - wiktrek.xyz</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
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
      </main>
    </>
  );
};

export default Home;
