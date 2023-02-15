import { faShuttleSpace } from "@fortawesome/free-solid-svg-icons";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React, { useState } from "react";

const Rng: NextPage = () => {
  const [numerr, setNumerr] = useState(false);
  const [result, setResult] = useState("");
  async function rng(e: React.SyntheticEvent) {
    e.preventDefault();
    function getnum() {
      // @ts-ignore: Object is possibly 'null'.
      let low = document.querySelector("#low").value;
      // @ts-ignore: Object is possibly 'null'.
      let max = document.querySelector("#max").value;
      if (low > max) return setResult("lower limit is higher than upper limit");

      const random = Math.floor(Math.random() * (max - low + 1) + low);
      return random;
    }
    const num = getnum();
    console.log();
    if (num === 0) return getnum();
    setResult(`${num}`);
  }

  return (
    <>
      <Head>
        <title>Rng - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <div className="">
        <ul className="">
          <form onSubmit={rng}>
            <li>
              <label>lower limit</label>
              <input type="number" name="low" id="low" />
            </li>
            <li>
              <label>upper limit</label>
              <input type="number" name="max" id="max" />
            </li>
            <button type="submit">generate random number</button>
          </form>
          <li>
            <a>{result}</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Rng;
