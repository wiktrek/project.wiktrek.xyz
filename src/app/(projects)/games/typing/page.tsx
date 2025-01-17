// I will finish this later
"use client";

import { useEffect, useState } from "react";

export default function Page() {
  const texts = ["a quick brown fox jumps over the lazy dog"];
  const [input, setInput] = useState("");
  useEffect(() => {
    if (window !== null) {
      window.addEventListener("keyup", (e) => {
        console.log("user clicked something!", e);
        setInput(input + e.key);
      });
    }
  }, []);
  return (
    <div>
      <div className="flex space-x-2">
        {texts[0]?.split(" ").map((c, i) => {
          return <div key={i}>{c}</div>;
        })}
      </div>
    </div>
  );
}
