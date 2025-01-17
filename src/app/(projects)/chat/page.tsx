"use client";

import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
interface Message {
  author: string;
  text: string;
}
export default function Page() {
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [messages, setMessages] = useState([] as Message[]);
  useEffect(() => {
    const { data } = api.message.getMessages.useQuery();
    setMessages(data as Message[]);
  }, []);
  const mutation = api.message.createMessage.useMutation();
  return (
    <main className="items-center justify-center text-center text-xl">
      {name == "" ? (
        <div className="text-2xl">
          <p>What&aposs your name?</p>
          <input
            id="name-input"
            placeholder="username"
            className="w-32 border-white text-center"
          />
          <br />
          <button
            onClick={() => {
              const text = (
                document.getElementById("name-input") as HTMLInputElement
              ).value;
              if (checkForBannedWords(text)) {
                return setError("Name contains banned words!");
              }
              if (text.length > 16) {
                return setError("Name too long!");
              }
              setName(text);
            }}
          >
            Enter chat
          </button>
          <p>{error}</p>
        </div>
      ) : (
        <div>
          Hi {name}!
          <div className="mx-auto h-[48rem] w-[30rem] rounded border-2 border-secondary text-left">
            <div className="flex h-[44rem] w-[30rem] flex-col-reverse overflow-y-scroll pl-2 pt-2 text-left scrollbar-thin">
              {messages.map((data, i) => {
                return <Message data={data} key={data.author + i} />;
              })}
            </div>
            <div className="pl-2">
              <input
                className="p-1"
                placeholder="Message"
                onInput={(e) => {
                  setInput((e.target as HTMLInputElement).value);
                }}
                value={input}
              />
              <button
                onClick={() => {
                  if (input.length > 64) {
                    return setError("Message too long!");
                  }
                  if (checkForBannedWords(input)) {
                    return setError("Message contains banned words!");
                  }
                  mutation.mutate({ author: name, text: input });
                }}
              >
                Send
              </button>
            </div>
          </div>
          <p>{error}</p>
          <div className="text-xl">
            <p className="text-2xl">Rules:</p>
            <p>1.No links</p>
            <p className="text-2xl">Notes:</p>
            <p>I am too lazy to make it use websockets (realtime updates)</p>
          </div>
        </div>
      )}
    </main>
  );
}
function Message(props: { data: Message }) {
  return (
    <div className="w-[28rem] break-words">
      <a className="text-primary">{props.data.author}</a>:{props.data.text}
    </div>
  );
}
function checkForBannedWords(str: string): boolean {
  const bannedWords = ["fuck", "shit", "cunt", "https://", "://", ".com"];
  return bannedWords.some((word) => str.toLowerCase().includes(word));
}
