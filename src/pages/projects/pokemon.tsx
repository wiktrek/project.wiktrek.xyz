import type { NextPage } from "next";
import Head from "next/head";
import React, { useState } from "react";

const Pokemon: NextPage = () => {
  return (
    <>
      <Head>
        <title>Pokemon - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <div>
        <button>button 1</button>
        <button>button 2</button>
      </div>
    </>
  );
};

export default Pokemon;
