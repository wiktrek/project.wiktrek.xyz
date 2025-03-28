// I will finish this later
"use client";

import { useEffect, useState } from "react";

export default function TypingGame() {
  const [text, setText] = useState<string>("");
  const [correct, setCorrect] = useState<number[]>([]);
  const generatedText = generateText();
  return (
    <div>
      <input
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          const { correct, wrong } = check(generatedText, e.target.value);
          setCorrect(correct);
        }}
        autoFocus
        className="w-96"
      />
      <div className="flex">
        {generatedText.split("").map((letter, index) => {
          if (letter === " ") {
            return <div key={index} className="w-2" />;
          }
          const isCorrect = correct.includes(index);
          return (
            <div
              key={index}
              className={`${isCorrect ? "text-green-500" : "text-red-600"}`}
            >
              {letter}
            </div>
          );
        })}
      </div>
      <div>{text}</div>
    </div>
  );
}
function generateText(): string {
  const texts = ["a quick brown fox jumps over the lazy dog"];

  const randomIndex = Math.floor(Math.random() * texts.length);
  return texts[randomIndex]!;
}
function check(
  text: string,
  text2: string,
): { correct: number[]; wrong: number[] } {
  const correct: number[] = [];
  const wrong: number[] = [];
  for (let i = 0; i < text.length; i++) {
    if (text[i] === text2[i]) {
      correct.push(i);
    } else {
      wrong.push(i);
    }
  }
  return { correct, wrong };
}
