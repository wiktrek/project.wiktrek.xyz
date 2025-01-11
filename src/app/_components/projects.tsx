"use client";
import Link from "next/link";
type Category = "Simple" | "Rust" | "Cool" | "Learning";
interface ProjectType {
  name: string;
  description: string;
  url: string;
  type: "project.wiktrek.xyz" | "other";
  category: Category;
}
const projects: ProjectType[] = [
  {
    name: "Poll app",
    description: "Poll creation and voting app",
    url: "/poll",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "Link shortener",
    description: "URL shortening service",
    url: "/url",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "Chat",
    description: "Simple chat app",
    url: "/chat",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "Term",
    description: "Terminal-like app",
    url: "/term",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "Os",
    description:
      "website that tries to look like a desktop of an operating system",
    url: "/os",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "Browser games",
    description: "browser games that I made",
    url: "/games",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "Other projects",
    description: "Other projects",
    url: "/other",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
];
export function Projects() {
  return <ProjectsByCategory projects={projects} />;
}
function Project(props: ProjectType) {
  const { name, description } = props;
  return (
    <div className="h-36 w-56 rounded-md bg-transparent p-2 text-left text-xl text-foreground shadow-md transition-all animate-out hover:scale-110 hover:cursor-pointer">
      <p className="text-xl text-primary">{name}</p>
      <p className="px-2 text-base">{description}</p>
    </div>
  );
}
function ProjectsByCategory(props: { projects: ProjectType[] }) {
  const filtered = props.projects.filter(
    (project) => project.category === "Cool",
  );
  return (
    <div className="top-16 flex w-full flex-col items-center justify-center text-center">
      <h1>Projects</h1>
      <div className="mx-auto grid-cols-3 gap-8 md:grid">
        {filtered.map((project) => {
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
  );
}
