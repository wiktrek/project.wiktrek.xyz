import Draggable from "react-draggable";
import { closeApp, runApp } from "../../lib/os";
import { useEffect, useRef, useState } from "react";
import type { Ref, RefObject } from "react";
interface App {
  name: string;
  icon: string;
  id: string;
}
const apps: App[] = [
  {
    name: "Blog",
    icon: "Blog Posts",
    id: "blog",
  },
  {
    name: "TicTacToe",
    icon: "TTT",
    id: "tictactoe",
  },
];

export function Apps() {
  return (
    <>
      <ul>
        {apps.map((app) => (
          <li key={app.id} className="flex cursor-pointer items-center p-4">
            <div
              className="flex flex-col items-center justify-center"
              onClick={() => closeApp(app.id)}
            >
              <p className="text-wrap rounded bg-background-950 p-4 text-xl font-extrabold">
                {app.icon}
              </p>
              <p className="ml-4text-xl">{app.name}</p>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
export function AppComponent({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const nodeRef = useRef<HTMLElement>(null);
  return (
    <div id={id} className="hidden">
      <Draggable nodeRef={nodeRef as RefObject<HTMLElement>} bounds={{ left: 50, top: -220, right: 1100, bottom: 280}} defaultPosition={{x: 100,y:100}}>
        <div
          className="absolute h-96 w-120 cursor-move rounded-xl bg-background-800 p-4 font-bold text-white"
          ref={nodeRef as Ref<HTMLDivElement>}
        >
          {children}
          <button
            className="absolute right-2 top-2 text-3xl text-red-500"
            onClick={() => runApp(id)}
          >
            X
          </button>
        </div>
      </Draggable>
    </div>
  );
}
