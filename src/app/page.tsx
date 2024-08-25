import type { NextPage } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Projects } from "~/app/_components/projects";
const Home: NextPage = () => {
  return (
    <>
      <div className="items-center justify-center overflow-y-hidden bg-background text-center text-3xl font-medium text-ring">
        <div className="absolute right-0">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div>
          <ul className="">
            <Projects />
            <li>
              <h1 className="pt-4">future Projects</h1>
            </li>
            <li>
              {/* <Link href="/projects/recipe"> */}
              <a>Recipe</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
