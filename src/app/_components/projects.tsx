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
    description: "Very very cool poll app",
    tags: ["next.js","neondb",'clerk',"drizzle","react","tailwind css"],
    url: "/poll",
  },
  {
    name: "Link shortener",
    description: "Very very cool link shortener",
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
  }
]
export function Projects() {
  return (
    <section id="projects"  className="flex flex-col w-screen items-center justify-center text-center h-[120vh]">
      <div className="w-[80vw] grid grid-cols-4 border-amber-400 border-2 justify-around">
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
    <Link key={p.name} className="border-2 border-red-900 rounded-2xl h-80 w-80 p-4 hover:scale-105 transition-all hover:cursor-crosshair" href={p.url}>
      <img src={p.image_url}></img>
      <p className="text-left text-xl">{p.name}</p>
      <p className="text-left text-lg">{p.description}</p>
      <div className="text-sm flex space-x-0.5 flex-wrap w-80">{p.tags.map(t => {
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