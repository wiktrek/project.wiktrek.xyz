"use client";
import type { NextPage } from "next";
import { motion } from "motion/react";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Projects } from "~/app/_components/projects";
const Home: NextPage = () => {
  return (
    <>
      <div className="bg-background text-ring items-center justify-center overflow-y-hidden text-center text-3xl font-medium">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-0"
        >
          <UserButton />
        </motion.div>
        <motion.div
          className="font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h1>My programming projects</h1>
          <ul>
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
        </motion.div>
      </div>
    </>
  );
};

export default Home;
