import type { NextPage } from "next";
import Link from "next/link";
import React from "react";

const Navbar: NextPage = () => {
  return (
    <>
      <div className="flex h-4 list-none items-center justify-between p-7 text-xl">
        <li>
          <a href="https://wiktrek.xyz" target="_blank" rel="noreferrer">
            wiktrek.xyz
          </a>
        </li>
        <li>
          <Link href="/">Projects</Link>
        </li>
      </div>
    </>
  );
};

export default Navbar;
