import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

const Navbar: NextPage = () => {
  return (
    <>
      <div className="top-0 flex h-4 list-none items-center justify-between p-7 text-2xl font-medium text-ring">
        <Link href="/">Projects</Link>
        <a href="https://wiktrek.xyz">wiktrek.xyz</a>
      </div>
    </>
  );
};

export default Navbar;
