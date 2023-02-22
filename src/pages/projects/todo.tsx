import type { NextPage } from "next";
import Head from "next/head";
import React from "react";
import { useState } from "react";
import Todo from "../components/todo";

const Home: NextPage = () => {
  function removeTodo(e: React.SyntheticEvent) {
    e.currentTarget.id;
  }
  return (
    <>
      <Head>
        <title>to do- wiktrek</title>
        <meta name="description" content="Rock paper scissors" />
      </Head>
      <div className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl">
        <button>Add a task</button>
        <div>
          <Todo name="tidy your room" />
          <input id="id" type="checkbox" onClick={removeTodo}></input>
        </div>
      </div>
    </>
  );
};

export default Home;
