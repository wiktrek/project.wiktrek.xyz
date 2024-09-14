"use client";

import { useState } from "react";

import { api } from "~/trpc/react";
export default function Page() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const mutation = api.message.createMessage.useMutation();
  return (
    <main className="items-center justify-center text-center">
      {name == "" ? (
        <div className="text-2xl">
          <p>What's your name?</p>
          <input
            id="name-input"
            placeholder="username"
            className="w-32 border-white text-center"
          />
          <br />
          <button
            onClick={() => {
              setName(
                (document.getElementById("name-input") as HTMLInputElement)
                  .value,
              );
            }}
          >
            Enter chat
          </button>
        </div>
      ) : (
        <div>
          Hi {name}!
          <div className="mx-auto h-96 w-80 rounded border-2 border-secondary">
            <input
              onInput={(e) => {
                setInput((e.target as HTMLInputElement).value);
              }}
              value={input}
            />
            <button
              onClick={() => {
                mutation.mutate({ author: name, text: input });
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
