"use client"

import Link from "next/link";

type TagType = "frontend" | "backend" | "ai" | "other";

type TagName = "next.js" | "neondb" | "golang" | "clerk" | "drizzle" | "react" | "tailwind css" | "three.js" | "shadcn ui" | "motion" | "docker";

interface Project {
  name: string;
  description: string;
  url: string;
  tags: TagName[];
}

const tags = {
  "next.js": "backend",
  neondb: "backend",
  golang: "backend",
  clerk: "backend",
  drizzle: "backend",
  react: "frontend",
  "tailwind css": "frontend",
  "three.js": "frontend",
  "shadcn ui": "frontend",
  motion: "frontend",
  docker: "other",
};
const projects: Project[] = [
  {
    name: "Poll",
    description: "Simple poll app",
    tags: ["next.js","neondb",'clerk',"drizzle","react","tailwind css"],
    url: "/poll",
  },
  {
    name: "Link shortener",
    description: "Link shortener",
    tags: ["next.js","neondb",'clerk',"drizzle","react","tailwind css"],
    url: "/url"
  },
  {
    name: "Chat",
    description: "Simple chat app",
    tags: ["next.js","neondb","golang","drizzle","react","tailwind css"],
    url: "/chat",
  },
  {
    name: "Os",
    description: "App that tries to look like an operating system",
    tags: ["tailwind css", "react"],
    url: "/os"
  },
  {
    name: "random team generator",
    description: "Generate random teams",
    tags: ["react", "tailwind css"],
    url: "/teamgenerator"
  },
  {
    name: "File explorer",
    description: "Terminal file explorer",
    tags: ["golang"],
    url: "https://github.com/wiktrek/file-explorer"
  }
  // {
  //   name: "Math",
  //   description: "Explaining basic math",
  //   tags: ["react", "tailwind css"],
  //   url: "/math"
  // }
]
export function Projects() {
  return (
    <section
      id="projects"
      className="w-screen px-6 md:px-10 py-20 md:py-28 flex justify-center bg-transparent"
    >
      <div className="w-full max-w-6xl">
        <div className="flex flex-col items-start gap-2 mb-10">
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-50">My projects</h2>
          <p className="max-w-2xl text-sm md:text-base text-neutral-300">
            Here are some of my projects
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Project key={project.name} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}
function tagValues(tag: TagName): number {
  switch (tags[tag]) {
    case "frontend": return 4;
    case "backend": return 3;
    case "ai": return 2;
    case "other": return 1;
  }
  return -1;
}
function Project({ project }: { project: Project }) {
  const sortedTags = [...project.tags].sort((a, b) => {
    if (tags[a] == tags[b]) {
      return a < b ? -1 : 1;
    }
    return tagValues(a) < tagValues(b) ? -1 : 1;
  })

  return (
    <Link
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-900/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_16px_32px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
      href={project.url}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="text-left text-lg md:text-xl font-semibold text-neutral-50">
          {project.name}
        </p>
      </div>
      <p className="mt-2 text-left text-sm md:text-base text-neutral-300 leading-relaxed">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {sortedTags.map((tag) => (
          <Tag tag={tag} key={tag} />
        ))}
      </div>
    </Link>
  )
}
function Tag(props: {tag: TagName}) {
  const type = tags[props.tag]
  const text = `#${props.tag}`
  switch (type) {
    case "frontend":
      return (
        <span className="rounded-full border border-sky-300/40 bg-sky-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-sky-200">
          {text}
        </span>
      )
    case "backend":
      return (
        <span className="rounded-full border border-emerald-300/40 bg-emerald-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-emerald-200">
          {text}
        </span>
      )
    case "ai":
      return (
        <span className="rounded-full border border-fuchsia-300/40 bg-fuchsia-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-fuchsia-200">
          {text}
        </span>
      )
    case "other":
      return (
        <span className="rounded-full border border-rose-400/40 bg-rose-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-rose-200">
          {text}
        </span>
      )
  }
  return (
    <span className="rounded-full border border-neutral-500/40 bg-neutral-500/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-neutral-200">
      {text}
    </span>
  )
}