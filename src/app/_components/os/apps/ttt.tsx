import { useEffect, useState } from "react";
import { AppComponent } from "./apps";
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
  for (const v of lines) {
    const [a, b, c] = v;
    if (array[a] && array[a] === array[b] && array[a] === array[c]) {
      return array[a];
    }
  }
  return "no";
}
export function TicTacToe() {
  const [board, setBoard] = useState<string[]>(Array(9).fill(null));
  const [player, setPlayer] = useState(true);
  const [win, setWin] = useState("no");
  useEffect(() => {
    const checked = check(board);
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
      const filtered = new Array<number>();
      board.map((b, i) => {
        if (b == null) {
          filtered.push(i);
        }
      });
      const randomIndex = Math.floor(Math.random() * filtered.length);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
