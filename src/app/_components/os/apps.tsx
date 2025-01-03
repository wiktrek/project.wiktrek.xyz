import Draggable from "react-draggable";
import { closeApp, runApp } from "../lib/os";
import { useEffect, useState } from "react";
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
export function BlogApp() {
  return (
    <AppComponent id="blog">
      <p className="text-xl">My blog posts</p>
      <ul>
        <li>
          <a
            href="https://wiktrek.xyz/blog/typing"
            target="_blank"
            className="text-accent"
          >
            Typing
          </a>
        </li>
        <li>
          <a
            href="https://wiktrek.xyz/blog"
            target="_blank"
            className="text-accent"
          >
            Read all my blog posts
          </a>
        </li>
      </ul>
    </AppComponent>
  );
}
export function AppComponent({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  return (
    <div id={id} className="hidden">
      <Draggable>
        <div className="absolute h-[24rem] w-[30rem] cursor-move rounded-xl bg-background-800 p-4 font-bold text-white">
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
function check(array: string[]): string {
  const lines: [number, number, number][] = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]!;
    if (array[a] && array[a] === array[b] && array[a] === array[c]) {
      return array[a];
    }
  }
  return "no";
}
export function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(true);
  const [win, setWin] = useState("no");
  useEffect(() => {
    let checked = check(board);
    if (checked != "no") {
      setWin(checked + " won!");
    } else {
      if (board.filter((b) => b == null).length == 0) {
        setWin("Draw");
      }
    }
  }, [board]);
  useEffect(() => {
    if (player == false) {
      if (check(board) != "no") {
        return;
      }
      let filtered = new Array<number>();
      board.map((b, i) => {
        if (b == null) {
          filtered.push(i);
        }
      });
      let randomIndex = Math.floor(Math.random() * filtered.length);
      setBoard(
        board.map((cell, index) => {
          if (cell === null && index === filtered[randomIndex]) {
            return "O";
          }
          return cell;
        }),
      );
      setPlayer(true);
    }
  }, [player]);
  return (
    <AppComponent id="tictactoe">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-center text-xl font-bold">Tic Tac Toe</h1>
        <p>{player ? "Your turn" : ""}</p>
        <p>{win != "no" ? win : ""}</p>
        <div className="grid grid-cols-3 grid-rows-3 gap-2">
          {board.map((b, i) => {
            if (b == null) {
              return (
                <button
                  className="h-16 w-16 rounded bg-background-50"
                  key={i}
                  onClick={() => {
                    if (player == true) {
                      if (check(board) != "no") {
                        return;
                      }
                      setBoard(
                        board.map((cell, index) => {
                          if (cell === null && index === i) {
                            return "X";
                          }
                          return cell;
                        }),
                      );
                      setPlayer(false);
                    }
                  }}
                ></button>
              );
            } else {
              return (
                <button
                  className="h-16 w-16 rounded bg-background-50 text-center text-xl font-bold text-black"
                  key={i}
                  disabled
                >
                  {b}
                </button>
              );
            }
          })}
        </div>
        <button
          onClick={() => {
            setBoard(Array(9).fill(null));
            setPlayer(true);
            setWin("no");
          }}
        >
          Reset
        </button>
      </div>
    </AppComponent>
  );
}
