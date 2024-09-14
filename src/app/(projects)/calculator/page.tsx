"use client";
import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faTrash } from "@fortawesome/free-solid-svg-icons";
const Home: NextPage = () => {
  const [screen, setScreen] = useState("");
  const [screen2, setScreen2] = useState("");
  const [screen3, setScreen3] = useState("");
  const [check, setCheck] = useState(false);
  const [x, setX] = useState("");
  function addnum(e: React.SyntheticEvent) {
    if (check === false) {
      if (screen.length > 7) return;
      setScreen(screen + e.currentTarget.id);
    } else {
      setScreen2(screen2 + e.currentTarget.id);
    }
  }
  function ok(e: React.SyntheticEvent) {
    setScreen3(e.currentTarget.id);
    setX(e.currentTarget.id);
    setCheck(true);
  }
  function clear() {
    setScreen("");
    setScreen2("");
    setScreen3("");
    setX("");
  }
  function clearone() {
    if (check === false) {
      setScreen(screen.slice(0, screen.length - 1));
    } else {
      setScreen2(screen2.slice(0, screen2.length - 1));
    }
  }
  function equals() {
    const a = parseFloat(screen);
    const b = parseFloat(screen2);
    const c = x;
    if (c === "x") {
      setScreen(`${(a * b).toString()}`);
      setScreen2("");
      setScreen3("");
      setCheck(false);
    }
    if (c === "-") {
      setScreen(`${(a - b).toString()}`);
      setScreen2("");
      setScreen3("");
      setCheck(false);
    }
    if (c === "+") {
      setScreen(`${(a + b).toString()}`);
      setScreen2("");
      setScreen3("");
      setCheck(false);
    }
    if (c === "/") {
      setScreen(`${(a / b).toString()}`);
      setScreen2("");
      setScreen3("");
      setCheck(false);
    }
    if (screen === NaN.toString()) return setScreen("Error");
  }
  return (
    <>
      <Head>
        <title>calculator - wiktrek</title>
        <meta name="description" content="calculator" />
      </Head>
      <div className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl">
        <div className="grid grid-cols-1">
          <div className="w-64 rounded bg-gray-500">
            <a className="">
              {screen}
              {screen3}
              {screen2}
            </a>
            <div className="float-right">
              <button onClick={clearone}>
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
              <button onClick={equals} className="text-2xl">
                =
              </button>
            </div>
          </div>
          <div className="">
            <div>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="1"
              >
                1
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="2"
              >
                2
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="3"
              >
                3
              </button>
              <button
                onClick={ok}
                className="h-16 w-16 rounded bg-gray-500"
                id="/"
              >
                /
              </button>
            </div>
            <div>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="4"
              >
                4
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="5"
              >
                5
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="6"
              >
                6
              </button>
              <button
                onClick={ok}
                className="h-16 w-16 rounded bg-gray-500"
                id="x"
              >
                x
              </button>
            </div>
            <div>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="7"
              >
                7
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="8"
              >
                8
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="9"
              >
                9
              </button>
              <button
                onClick={ok}
                className="h-16 w-16 rounded bg-gray-500"
                id="-"
              >
                -
              </button>
            </div>
            <div>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="0"
              >
                0
              </button>
              <button
                onClick={addnum}
                className="h-16 w-16 rounded bg-gray-500"
                id="."
              >
                .
              </button>
              <button
                onClick={clear}
                className="h-16 w-16 rounded bg-gray-500"
                id="clear"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
              <button
                onClick={ok}
                className="h-16 w-16 rounded bg-gray-500"
                id="+"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
