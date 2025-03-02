import type { NextPage } from "next";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Projects } from "~/app/_components/projects";
const Home: NextPage = () => {
  return (
    <>
      <div className="items-center justify-center overflow-y-hidden bg-background text-center text-3xl font-medium text-ring">
        <div className="absolute right-0">
          <UserButton />
        </div>
        <div className="font-semibold">
          <h1>My programming projects</h1>
          <ul className="">
            <Projects />
            <li>
              <h1 className="pt-4">future Projects</h1>
            </li>
            <li>
              {/* <Link href="/projects/recipe"> */}
              <p className="text-text">Recipe</p>
              <p className="text-text">Finance</p>
              {/* </Link> */}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
