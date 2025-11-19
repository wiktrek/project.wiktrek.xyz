"use client";
import { motion } from "motion/react";
import Link from "next/link";
type Tags = "Next.js" | "Typescript" | "";
interface ProjectType {
  name: string;
  description: string;
  url: string;
  type: "project.wiktrek.xyz" | "other";
  tags: Tags[];
}
const projects: ProjectType[] = [
  {
    name: "Poll app",
    description: "Poll creation and voting app",
    url: "/poll",
    type: "project.wiktrek.xyz",
    tags: ["Next.js", "Typescript"],
  },
  {
    name: "Link shortener",
    description: "URL shortening service",
    url: "/url",
    type: "project.wiktrek.xyz",
    tags: ["Next.js", "Typescript"],
  },
  {
    name: "Chat",
    description: "Simple chat app",
    url: "/chat",
    type: "project.wiktrek.xyz",
    tags: ["Next.js", "Typescript"],
  },
  {
    name: "Term",
    description: "Terminal-like app",
    url: "/term",
    type: "project.wiktrek.xyz",
    tags: ["Next.js", "Typescript"],
  },
  {
    name: "Os",
    description:
      "website that tries to look like a desktop of an operating system",
    url: "/os",
    type: "project.wiktrek.xyz",
    tags: ["Next.js", "Typescript"],
  },
  {
    name: "Browser games",
    description: "browser games that I made",
    url: "/games",
    type: "project.wiktrek.xyz",
    tags: ["Next.js", "Typescript"],
  },
];
export function Projects() {
  return (
    <div className="flex h-[150vh] justify-center pt-8 md:h-[60vh]">
      <div className="grid h-[140vh] md:h-[50vh] md:grid-cols-4">
        {projects.map((p) => (
          <a
            href={`https://${p.type}${p.url}`}
            key={p.name}
            className="bg-background-901 rounded-x mx-4 h-48 w-64 p-3 text-left shadow transition-all hover:scale-105"
          >
            <p className="pl-4 text-2xl">{p.name}</p>
            <p className="py-4 text-xl">{p.description}</p>
            <div className="flex">
              {p.tags.map((m) => (
                <h4 key={m} className="bg-accent ml-2 rounded-xl px-2 text-lg">
                  {m}
                </h4>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
function OtherProjects() {
  return (
    <div>
      <p>Other projects</p>
    </div>
  );
}
