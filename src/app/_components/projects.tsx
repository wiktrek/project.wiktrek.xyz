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
/*




    Categorize projects
    Sort projects by category
    hide projects with categories !== Cool




 */
const projects: ProjectType[] = [
  {
    name: "Term",
    description: "Terminal-like app",
    url: "/term",
    type: "project.wiktrek.xyz",
    category: "Cool",
  },
  {
    name: "poll app",
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
    name: "svelte",
    description: "App made with svelte",
    url: "https://svelte.wiktrek.xyz",
    type: "other",
    category: "Learning",
  },
  {
    name: "Info",
    description: "Frontend projects",
    url: "https://info.wiktrek.xyz",
    type: "other",
    category: "Learning",
  },
  {
    name: "Password manager",
    description: "Local password manager made in rust",
    url: "https://github.com/wiktrek/password.rs",
    type: "other",
    category: "Rust",
  },
  {
    name: "Rust API",
    description: "Api made in rust",
    url: "https://github.com/wiktrek/rustapi",
    type: "other",
    category: "Rust",
  },
  {
    name: "wiktrekbot",
    description: "Discord bot",
    url: "https://github.com/wiktrek/wiktrekbot",
    type: "other",
    category: "Learning",
  },
  {
    name: "rust",
    description: "Rust projects",
    url: "https://github.com/wiktrek/rust",
    type: "other",
    category: "Rust",
  },
  {
    name: "Electron app",
    description: "Electron app",
    url: "https://github.com/wiktrek/electron",
    type: "other",
    category: "Learning",
  },
  {
    name: "calculator",
    description: "Calculator app",
    url: "/calculator",
    type: "project.wiktrek.xyz",
    category: "Simple",
  },
  {
    name: "rock paper scissors",
    description: "Rock paper scissors game",
    url: "/rps",
    type: "project.wiktrek.xyz",
    category: "Simple",
  },
  {
    name: "random number generator",
    description: "Random number generator",
    url: "/rng",
    type: "project.wiktrek.xyz",
    category: "Simple",
  },
  {
    name: "Team generator",
    description: "Randomize teammates into teams",
    url: "/teamgenerator",
    type: "project.wiktrek.xyz",
    category: "Simple",
  },
  {
    name: "better code editor",
    description: "I tried making a code editor",
    url: "https://github.com/wiktrek/better-code-editor",
    type: "other",
    category: "Learning",
  },
];
export function Projects() {
  return <ProjectsByCategory projects={projects} />;
}
function Project(props: ProjectType) {
  const { name, description } = props;
  return (
    <div className="h-36 w-56 rounded-md bg-transparent p-2 text-left text-xl text-foreground shadow-md transition-all animate-out hover:scale-110 hover:cursor-pointer">
      <a className="text-xl text-primary">{name}</a>
      <p className="px-2 text-base">{description}</p>
    </div>
  );
}
function ProjectsByCategory(props: { projects: ProjectType[] }) {
  const filtered = props.projects.filter(
    (project) => project.category === "Cool",
  );
  function Show_Category() {}
  return (
    <div className="top-16 flex w-full flex-col items-center justify-center text-center">
      <div className="mx-auto grid grid-cols-3 gap-8">
        {filtered.map((project) => {
          const { url, type } = project;
          return (
            <div>
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
        <Button category="Simple" />
        <Button category="Rust" />
        <Button category="Learning" />
        {props.projects
          .sort((a, b) => {
            if (a.category < b.category) return -1;
            if (a.category > b.category) return 1;
            return 0;
          })
          .filter((project) => project.category !== "Cool")
          .map((project) => {
            const { url, type } = project;
            return (
              <div className={`hidden ${project.category}`}>
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
function Button(props: { category: Category }) {
  return (
    <div>
      <button
        id={props.category}
        onClick={(e) => {
          // hide all other categories
          const types: Category[] = ["Learning", "Rust", "Simple"];
          types.map((type) => {
            const documents = document.querySelectorAll(`.${type}`);
            documents.forEach((doc) => {
              if (!doc.classList.contains("hidden")) {
                doc.classList.toggle("hidden");
              }
            });
          });
          const documents = document.querySelectorAll(`.${props.category}`);
          documents.forEach((document) => {
            document.classList.toggle("hidden");
          });
        }}
        className="h-36 w-56 rounded-md bg-transparent p-2 text-center text-2xl text-foreground shadow-md transition-all animate-out hover:scale-110 hover:cursor-pointer"
      >
        {props.category} projects
      </button>
    </div>
  );
}
