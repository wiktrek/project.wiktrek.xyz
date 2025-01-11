import type { NextPage } from "next";
import Link from "next/link";
import React from "react";
interface ProjectType {
  name: string;
  description: string;
  url: string;
  type: "project.wiktrek.xyz" | "other";
}
const projects: ProjectType[] = [
  {
    name: "svelte",
    description: "App made with svelte",
    url: "https://svelte.wiktrek.xyz",
    type: "other",
  },
  {
    name: "Info",
    description: "Frontend projects",
    url: "https://info.wiktrek.xyz",
    type: "other",
  },
  {
    name: "Password manager",
    description: "Local password manager made in rust",
    url: "https://github.com/wiktrek/password.rs",
    type: "other",
  },
  {
    name: "Rust API",
    description: "Api made in rust",
    url: "https://github.com/wiktrek/rustapi",
    type: "other",
  },
  {
    name: "wiktrekbot",
    description: "Discord bot",
    url: "https://github.com/wiktrek/wiktrekbot",
    type: "other",
  },
  {
    name: "rust",
    description: "Rust projects",
    url: "https://github.com/wiktrek/rust",
    type: "other",
  },
  {
    name: "Electron app",
    description: "Electron app",
    url: "https://github.com/wiktrek/electron",
    type: "other",
  },
  {
    name: "calculator",
    description: "Calculator app",
    url: "/calculator",
    type: "project.wiktrek.xyz",
  },
  {
    name: "rock paper scissors",
    description: "Rock paper scissors game",
    url: "/rps",
    type: "project.wiktrek.xyz",
  },
  {
    name: "random number generator",
    description: "Random number generator",
    url: "/rng",
    type: "project.wiktrek.xyz",
  },
  {
    name: "Team generator",
    description: "Randomize teammates into teams",
    url: "/teamgenerator",
    type: "project.wiktrek.xyz",
  },
  {
    name: "better code editor",
    description: "I tried making a code editor",
    url: "https://github.com/wiktrek/better-code-editor",
    type: "other",
  },
];
const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center overflow-y-hidden bg-background text-center text-3xl font-medium text-ring">
        <h1>My other projects</h1>
        <div className="grid grid-cols-4">
          {projects.map((project) => {
            const { url, type } = project;
            return (
              <div key={url}>
                {type === "project.wiktrek.xyz" ? (
                  <Link href={url}>
                    <Project key={project.name} {...project} />
                  </Link>
                ) : (
                  <a href={url}>
                    <Project key={project.name} {...project} />
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
function Project(props: ProjectType) {
  const { name, description } = props;
  return (
    <div className="h-36 w-56 rounded-md bg-transparent p-2 text-left text-xl text-foreground shadow-md transition-all animate-out hover:scale-110 hover:cursor-pointer">
      <a className="text-xl text-primary">{name}</a>
      <p className="px-2 text-base">{description}</p>
    </div>
  );
}
export default Home;
