"use client";

import { Apps, BlogApp, Snake } from "~/app/_components/os/apps";

export default function Page() {
  return (
    <div className="mx-auto flex">
      <Main />
    </div>
  );
}
function Main() {
  return (
    <div className="mx-auto h-[100vh] w-[90%] bg-background-300">
      <Apps />
      <Snake />
      <BlogApp />
    </div>
  );
}
