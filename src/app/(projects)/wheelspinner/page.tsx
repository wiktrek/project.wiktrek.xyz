"use client"
// /*

// I will finish this sometime in the future

// */
import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useRef } from "react";
import Wheel from "~/app/_components/wheel"
const Page: NextPage = () => {

  return (
    <> 
      <Head>
        <title>Wheel spinner- wiktrek</title>
        <meta name="description" content="Rock paper scissors" />
      </Head>
      <div className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl">
        <a>wiktrek</a>
        <Wheel elements={["wiktrek","Dev", "Other","works?","eeee","something"]}/>
      </div>
    </>
  );
};
export default Page;
function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// const Page: NextPage = () => {
// return (
//     <a>No</a>
// )
// }