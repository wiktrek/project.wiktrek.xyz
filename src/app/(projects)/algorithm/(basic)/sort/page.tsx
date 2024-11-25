"use client";
import type { NextPage } from "next";
import Link from "next/link";
const Home: NextPage = () => {
  return (
    <main className="items-center justify-center text-center">
      <div className="text-left text-2xl">
        <p className="text-3xl font-bold">What is sorting?</p>
        <p>
          Sorting refers to rearrangement of a given array or list of elements
          according to a comparison operator on the elements.{" "}
        </p>
        <p>Basic sorting algorithm</p>
      </div>
    </main>
  );
};
export default Home;
