"use client";
import { useState } from "react";

export default function Page() {
  const [buttonStyle, setButtonStyle] = useState({
    left: "50%",
    top: "50%",
  });
  function random() {
    const i = randomInt(window.screen.width - 200);
    const j = randomInt(window.screen.height - 400);
    setButtonStyle({
      left: i + "px",
      top: j + "px",
    });
  }
  return (
    <button
      style={buttonStyle}
      className="absolute h-16 w-16 rounded-full bg-red-700"
      onClick={random}
    ></button>
  );
}
function randomInt(max: number) {
  return Math.floor(Math.random() * (max - 0 + 1) + 0);
}
