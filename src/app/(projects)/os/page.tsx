"use client";

import { Apps } from "~/app/_components/os/apps/apps";
import { BlogApp } from "~/app/_components/os/apps/blog";
import { TicTacToe } from "~/app/_components/os/apps/ttt";
export default function Page() {
  return (
    <div className="mx-auto flex">
      <Main />
    </div>
  );
}
function Main() {
  return (
    <div className="mx-auto h-[90vh] w-[95%] bg-background-300">
      <Apps />
      <TicTacToe />
      <BlogApp />
    </div>
  );
}
