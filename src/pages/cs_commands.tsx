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
    const commands = e.currentTarget.id;
    commands_json.commands.map((command) => {
      if (command.id === commands) {
        copy(command.command);
        setResult(command.name + ":");
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
        <meta name="description" content="Random number generator" />
      </Head>
      <div className="items-center justify-center text-center">
        {commands_json.commands.map((command) => {
          return (
            <div key="key">
              <button onClick={copy_command} id={command.id}>
                {command.name}
              </button>
              {copied ? (
                <p>
                  <button onClick={hide}>hide</button>
                </p>
              ) : (
                ""
              )}
              <p>{copied ? "copied commands!" : ""}</p>
              <p>{result}</p>
              {commandResult.map((e) => {
                return <p key="key">{e}</p>;
              })}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Cs_commands;
