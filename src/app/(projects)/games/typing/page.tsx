// I will finish this later
"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const texts = ["a quick brown fox jumps over the lazy dog"];
  const [correct, setCorrect] = useState<number[]>([]);
  const [input, setInput] = useState("");
  useEffect(() => {
    const controller = new AbortController();
    if (window !== null) {
      window.addEventListener(
        "keyup",
        (e) => {
          if (e.key == "Backspace") {
            return setInput((prevInput) => {
              const newInput = prevInput.slice(0, -1);
              setCorrect(compareStrings(newInput, texts[0]!));
              return newInput;
            });
          }
          setInput((prevInput) => {
            const newInput = `${prevInput}${e.key}`;
            setCorrect(compareStrings(newInput, texts[0]!));
            return newInput;
          });
        },
        {
          signal: controller.signal,
        },
      );
    }

    return () => controller.abort();
  }, []);
  return (
    <div>
      <div className="flex space-x-2">
        {texts[0]?.split(" ").map((c, i) => {
          return (
            <div key={i} style={{ color: correct[i] ? "green" : "red" }}>
              {c}
            </div>
          );
        })}
      </div>
      <div className="mt-4">
        <p>Input: {input}</p>
      </div>
    </div>
  );
}
function compareStrings(input: string, text: string): number[] {
  let correct: number[] = [];
  const inputWords = input.split(" ");
  const textWords = text.split(" ");
  console.log(inputWords);
  console.log(textWords);
  inputWords.forEach((w, i) => {
    correct[i] = w === textWords[i] ? 1 : 0;
  });
  return correct;
}
