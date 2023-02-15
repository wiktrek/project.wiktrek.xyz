import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import React from "react";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>tictactoe - wiktrek</title>
        <meta name="description" content="tictactoe" />
      </Head>
      <div className="">
        <ul className="">
          <li>
            <a>ig</a>
          </li>
          <li>
            <a>github</a>
          </li>
          <li>
            <a>twitch</a>
          </li>
          <li>
            <a>website</a>
          </li>
        </ul>
      </div>
    </>
  );
};

export default Home;
