"use client"

import Link from "next/link";

type TagType = "frontend" | "backend" | "ai" | "other";

type TagName = "next.js" | "neondb" | "golang" | "clerk" | "drizzle" | "react" | "tailwind css" | "three.js" | "shadcn ui" | "motion" | "docker";

interface Project {
  name: string;
  description: string;
  image_url?: string;
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
    <section id="projects"  className="flex flex-col w-screen items-center justify-center text-center h-[140vh] md:h-[120vh]">
      <div className="md:w-[60vw] lg:w-[72vw] xl:w-[72vw] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 justify-around gap-y-4">
        {projects.map(p => Project(p))}
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
function Project(p: Project) {
  p.tags.sort((a,b) => {
    if (tags[a] == tags[b]) {
      if (a < b) {
        return -1;
      } else {
        return 1;
      }
    } else {
      if (tagValues(a) < tagValues(b)) {
        return -1;
      } else {
        return 1;
      }
    }
  })
  return (
    <Link key={p.name} className="border-2 rounded-2xl h-52 w-48 p-2 hover:scale-105 transition-all hover:cursor-crosshair md:w-60 md:h-64 lg:w-72 lg:h-72 xl:w-80 xl:h-80 md:p-4" href={p.url}>
      <img src={p.image_url}></img>
      <p className="text-left text-lg md:text-xl">{p.name}</p>
      <p className="text-left text-base md:text-lg">{p.description}</p>
      <div className="text-xs md:text-sm flex space-x-0.5 flex-wrap w-40 md:w-60 lg:w-80">{p.tags.map(t => {
        return <Tag tag={t} key={t}/>
      })}</div>
    </Link>
  )
}
function Tag(props: {tag: TagName}) {
  const type = tags[props.tag]
  const text = `#${props.tag}`
  switch (type) {
    case "frontend":
      return (<h3 className="text-blue-400">{text}</h3>)
    case "backend":
      return (<h3 className="text-green-400">{text}</h3>)
    case "ai":
      return (<h3 className="text-white">{text}</h3>)
    case "other":
      return (<h3 className="text-red-700">{text}</h3>)
  }
  return (
    <h3>{text}</h3>
  )
}