"use client";
import type { NextPage } from "next";
import { motion } from "motion/react";
import { UserButton } from "@clerk/nextjs";
import React from "react";
import { Projects } from "~/app/_components/projects";
const Home: NextPage = () => {
  return (
    <>
      <div className="bg-background text-ring items-center justify-center overflow-y-hidden text-center text-3xl font-medium h-[200vh]">
        <Projects />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute right-0 top-4"
        >
          <UserButton />
        </motion.div>
      </div>
    </>
  );
};

export default Home;