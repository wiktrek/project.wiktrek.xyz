"use client";
import type { NextPage } from "next";
import Link from "next/link";
const Home: NextPage = () => {
  return (
    <main className="items-center justify-center text-center">
      <div className="text-2xl">
        <p>
          <Link href="/algorithm/#algs" className="font-bold text-accent">
            This
          </Link>{" "}
          is a list of algorithms I've learned
        </p>
      </div>
    </main>
  );
};
export default Home;
