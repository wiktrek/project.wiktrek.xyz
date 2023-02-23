import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import Todo from "../components/todo";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");
const Home: NextPage = () => {
  const [todos, setTodos] = useState([{}]);
  function removeTodo(e: React.SyntheticEvent) {
    const name = e.currentTarget.id;
    todos.push({ name: name });
    console.log(todos);
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
          <input id="1" type="checkbox" onClick={removeTodo}></input>
        </div>
        <div>
          <Todo name="tidy your room" />
          <input id="3" type="checkbox" onClick={removeTodo}></input>
        </div>
      </div>
    </>
  );
};

export default Home;
