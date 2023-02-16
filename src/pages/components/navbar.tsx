import type { NextPage } from "next";
import React from "react";

const Navbar: NextPage = () => {
  return (
    <>
      <div className="text-1xl flex h-4 list-none items-center justify-between p-7">
        <li>
          <a>wiktrek.xyz</a>
        </li>
        <li>
          <a>Projects</a>
        </li>
      </div>
    </>
  );
};

export default Navbar;
