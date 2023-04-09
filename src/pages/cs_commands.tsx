/* eslint-disable @typescript-eslint/ban-ts-comment */
import copy from "copy-to-clipboard";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import commands_json from "./data/cs_commands.json";
const Cs_commands: NextPage = () => {
  const [result, setResult] = useState("");
  const [commandResult, setCommandResult] = useState([] as string[]);
  const [copied, setCopied] = useState(false);
  function copy_command(e: React.SyntheticEvent) {
    setResult(" ");
    setCommandResult([]);
    setCopied(false);
    const commands = e.currentTarget.id;
    commands_json.commands.map((command) => {
      if (command.id === commands) {
        copy(command.command);
        setResult(command.name);
        setCopied(true);
        const array = command.command.split(";");
        array.forEach((splitted) => {
          const result = commandResult;
          result.push(splitted);
          setCommandResult(result);
        });
      }
    });
  }
  function hide() {
    setResult(" ");
    setCommandResult([]);
    setCopied(false);
  }
  return (
    <>
      <Head>
        <title>csgo commands - wiktrek</title>
        <meta name="description" content="csgo commands" />
      </Head>
      <div className="items-center justify-center text-center">
        {commands_json.commands.map((command) => {
          return (
            <>
              {result === command.name ? (
                <div key="key" className="text-xl">
                  <button onClick={copy_command} id={command.id}>
                    {result + ":"}
                  </button>

                  {copied ? (
                    <p>
                      <button onClick={hide}>hide</button>
                    </p>
                  ) : (
                    ""
                  )}
                  <p className=" text-green-400">
                    {copied ? "copied commands!" : ""}
                  </p>
                  {commandResult.map((e) => {
                    return <p key="key">{e}</p>;
                  })}
                </div>
              ) : (
                <p className="text-xl">
                  <button onClick={copy_command} id={command.id}>
                    {command.name}
                  </button>
                </p>
              )}
            </>
          );
        })}
      </div>
    </>
  );
};

export default Cs_commands;
