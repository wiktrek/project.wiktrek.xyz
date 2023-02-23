import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import Todo from "../components/todo";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");
interface Todo {
  name: string;
  id: string;
}
const Home: NextPage = () => {
  const [todos, setTodos] = useState([{} as Todo]);
  function removeTodo(e: React.SyntheticEvent) {
    const todoarr = [{} as Todo];

    todos.map((todo) => {
      if (todo.id === e.currentTarget.id) return;
      if (todo.name === "") return;
      todoarr.push(todo);
    });
    setTodos(todoarr);
    // todos.push({ name: name, id: e.currentTarget.id });
    console.log(todos);
  }
  function addTodo(e: React.SyntheticEvent) {
    return e;
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
