"use client"
type TagType = "frontend" | "backend" | "ai" | "other";

type TagName = "next.js" | "neondb" | "golang" | "clerk" | "drizzle" | "react" | "tailwind css" | "three.js" | "shadcn ui" | "motion" | "docker";

interface Project {
  name: string;
  description: string;
  image_url?: string;
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
    tags: ["next.js","neondb",'clerk',"drizzle","react","tailwind css"]
  },
  {
    name: "Link shortener",
    description: "Very very cool link shortener",
    tags: ["next.js","neondb",'clerk',"drizzle","react","tailwind css"]
  },
  {
    name: "Chat",
    description: "Simple chat app",
    tags: ["next.js","neondb","golang","drizzle","react","tailwind css"]
  }
]
export function Projects() {
  return (
    <section id="projects"  className="flex flex-col w-screen items-center justify-center text-center h-[120vh] mt-42">
      <div>
        Pls wait I'm working on something...
      </div>
      <div className="grid grid-cols-3 grid-rows-4 gap-x-8 w-screen border-2 mt-4 justify-center items-center text-center">
        {projects.map(p => Project(p))}
      </div>
    </section>
  )
}
function Project(p: Project) {
  return (
    <div key={p.name} className="border-2 border-red-900 rounded-2xl h-80 w-80 p-4 hover:scale-105 transition-all">
      <img src={p.image_url}></img>
      <p className="text-left">{p.name}</p>
      <p className="text-left">{p.description}</p>
      <h3 className="text-sm">{p.tags}</h3>
    </div>
  )
}
function Tag(tag: TagName) {
  const type = tags[tag]
  let color = ""
  switch (type) {
    case "frontend":
      color = "white"
    case "backend":
      color = "green"
    case "ai":
      color = "red"
    case "other":
      color = "gray"
  }
  return (
    <p>{tag}</p>
  )
}