"use client";

import { parseConnectionParamsFromUnknown } from "@trpc/server/unstable-core-do-not-import";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";
interface Message {
  author: string;
  text: string;
}

let conn: WebSocket;
export default function Page() {  
  const mutation = api.message.createMessage.useMutation();
  const [name, setName] = useState("");
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [coolDown, setCoolDown] = useState(false)
  const [messages, setMessages] = useState([] as Message[]);
  const { data, isLoading } = api.message.getMessages.useQuery();
  useEffect(() => {
    if (!isLoading && data) {
      setMessages(data as Message[]);
    }
  }, [isLoading, data]);
  useEffect(() => {
    connectWS()
    return () => {
      if (conn) {
        conn.close();
      }
    }
  }, [])
  useEffect(() => {
      if (coolDown) {
        setTimeout(() => {
          setCoolDown(false)
        }, 750);
        setError("");
      }
  }, [coolDown])
  function connectWS() {
    const host = "selfhosted.wiktrek.xyz/api"
    conn = new WebSocket("ws://" + host + "/ws");
    conn.onclose = function (evt) {
      // setError("Websocket unreachable ( Its probably not your fault )")
    };
    conn.onmessage = function (evt) {
        let msg = JSON.parse(evt.data) as Message;
        setMessages((prevMessages) => [msg, ...prevMessages])
    };
    return conn
  }
  return (
    <main className="items-center justify-center text-center text-xl">
      {name == "" ? (
        <div className="text-2xl">
          <p>What&apos;s your name?</p>
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
          <div className="border-secondary mx-auto h-192 w-120 rounded border-2 text-left">
            <div className="scrollbar-thin flex h-176 w-120 flex-col-reverse overflow-y-scroll pt-2 pl-2 text-left">
              {
              messages.map((data, i) => {
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
                  if (!coolDown) {
                    mutation.mutate({ author: name, text: input });
                    if (conn) {
                      conn.send(JSON.stringify({
                        author: name,
                        text: input
                      }))
                    }
                    setCoolDown(true);
                    setError("")
                  } else {
                    setError("You have to wait 0.75s before sending another message!")
                  }
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
          </div>
          <div>
            <p className="text-2xl">Notes:</p>
            <p>Websockets are currently disabled</p>
          </div>
        </div>
      )}
    </main>
  );
}
function Message(props: { data: Message }) {
  return (
    <div className="w-md wrap-break-word">
      <a className="text-primary">{props.data.author}</a>:{props.data.text}
    </div>
  );
}
function checkForBannedWords(str: string): boolean {
  const bannedWords = ["fuck", "shit", "cunt", "https://", "://", ".com"];
  return bannedWords.some((word) => str.toLowerCase().includes(word));
}
