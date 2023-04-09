/* eslint-disable @typescript-eslint/ban-ts-comment */
import copy from "copy-to-clipboard";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import commands from "./data/cs_commands.json";
const Cs_commands: NextPage = () => {
  const [result, setResult] = useState("");
  function hns() {
    const commands = "";
    copy(commands);
    setResult("hide and seek: " + commands);
  }
  return (
    <>
      <Head>
        <title>csgo commands - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <div className="items-center justify-center text-center">
        {}
        <button onClick={hns}>hide and seek</button>
        <a>{result}</a>
      </div>
    </>
  );
};

export default Cs_commands;
