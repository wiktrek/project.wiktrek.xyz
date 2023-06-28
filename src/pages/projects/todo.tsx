import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";

import Todo from "../../components/todo";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");
interface Todo {
  name: string;
  id: string;
}
const Home: NextPage = () => {
  const [todos, setTodos] = useState([
    { name: "example", id: "1" } as Todo,
  ] as Array<Todo>);
  useEffect(() => {
    setTodos(JSON.parse(localStorage.getItem("todos") || "{}"));
  }, []);

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
  function addTodo() {
    const input = document.getElementById("input");
    if (!input) return;
    const value = (input as HTMLInputElement).value;
    console.log(value);
    const todoarr = [{} as Todo];
    todoarr.push({
      name: value,
      id: uuidv4(),
    } as Todo);
    todos.map((todo) => {
      todoarr.push(todo);
    });
    localStorage.setItem("todos", JSON.stringify(todos));
    // e.preventDefault();
    // todos.push();
    // return e;
  }
  return (
    <>
      <Head>
        <title>to do- wiktrek</title>
        <meta name="description" content="Rock paper scissors" />
      </Head>
      <div className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl">
        {todos.map((data, index) => {
          if (data.name !== "")
            return (
              <div key={index}>
                <Todo name={data.name} />
                <input
                  id={data.id}
                  type="checkbox"
                  onClick={removeTodo}
                ></input>
              </div>
            );
        })}
        <form onSubmit={addTodo} className="">
          <input type="text" id="input" className="text-black"></input>
          <label>Task Name</label>
          <button>Add task</button>
        </form>
        <a>I will finish this in the future</a>
      </div>
    </>
  );
};

export default Home;
