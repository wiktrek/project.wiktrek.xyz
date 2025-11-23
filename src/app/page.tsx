"use client";
import type { NextPage } from "next";
import { Projects } from "~/app/_components/projects";
import { ClerkUser } from "./_components/clerk";
const Home: NextPage = () => {
  return (
    <>
      <div className="bg-background text-ring items-center justify-center overflow-y-hidden text-center text-3xl font-medium h-[200vh]">
        <Projects />
        <ClerkUser />
      </div>
    </>
  );
};

export default Home;