import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useState } from "react";
import Todo from "../components/todo";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Rock paper scissors - wiktrek</title>
        <meta name="description" content="Rock paper scissors" />
      </Head>
      <div className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl">
        <button>Add a task</button>
        <Todo name="tidy your room" />
      </div>
    </>
  );
};

export default Home;
