/* eslint-disable @typescript-eslint/ban-ts-comment */
import copy from "copy-to-clipboard";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import commands_json from "./data/cs_commands.json";
const Cs_commands: NextPage = () => {
  const [result, setResult] = useState("");
  function copy_command(e: React.SyntheticEvent) {
    const commands = e.currentTarget.id;
    // copy(commands);
    console.log(commands);
    setResult("hide and seek: " + commands);
  }
  return (
    <>
      <Head>
        <title>csgo commands - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <div className="items-center justify-center text-center">
        {commands_json.commands.map((command) => {
          return (
            <div key="key">
              <button onClick={copy_command} id={command.id}>
                {command.name}
              </button>
              <p>{result}</p>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cs_commands;
