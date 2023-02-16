import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";

const Rng: NextPage = () => {
  const [result, setResult] = useState("");
  async function rng(e: React.SyntheticEvent) {
    e.preventDefault();
    function getnum() {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Object is possibly 'null'.
      const low = document.querySelector("#low").value;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore: Object is possibly 'null'.
      const max = Number(document.querySelector("#max").value) + 1;
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
      <div className="items-center justify-center text-center">
        <ul className="">
          <form onSubmit={rng}>
            <li>
              <label>lower limit</label>
              <input className="text-black" type="number" name="low" id="low" />
            </li>
            <li>
              <label>upper limit</label>
              <input className="text-black" type="number" name="max" id="max" />
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
