"use client";

import type { NextPage } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const Navbar: NextPage = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/link/")) return null;

  return (
    <>
      <nav className="text-ring top-0 flex h-4 list-none items-center justify-between p-7 text-2xl font-medium">
        <Link href="/">Projects</Link>
        <a href="https://wiktrek.xyz">wiktrek.xyz</a>
      </nav>
    </>
  );
};

export default Navbar;
