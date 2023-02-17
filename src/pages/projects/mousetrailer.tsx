import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect } from "react";

const Rng: NextPage = () => {
  useEffect(() => {
    const trailer = document.getElementById("trailer");
    if (trailer !== null) {
      window.onmousemove = (e) => {
        const x = e.clientX - trailer.offsetWidth / 2,
          y = e.clientY - trailer.offsetHeight / 2;
        const keyframes = {
          transform: `translate(${x}px,${y}px)`,
        };
        trailer.animate(keyframes, { duration: 800, fill: "forwards" });
      };
    }
  }, []);
  return (
    <>
      <Head>
        <title>mousetrailer - wiktrek</title>
        <meta name="description" content="Random number generator" />
      </Head>
      <main className="group box-border flex h-screen overflow-hidden">
        <div
          id="trailer"
          className="ease fixed top-0 left-0 z-50 h-10 w-10 rounded-full bg-white opacity-0 transition-opacity duration-500 group-hover:opacity-100  "
        ></div>
      </main>
    </>
  );
};

export default Rng;
