import Link from "next/link";

interface ProjectType {
  name: string;
  description: string;
  url: string;
  type: "project.wiktrek.xyz" | "other";
}
const projects: ProjectType[] = [
  {
    name: "Term",
    description: "Terminal-like app",
    url: "/term",
    type: "project.wiktrek.xyz",
  },
  {
    name: "poll app",
    description: "Poll creation and voting app",
    url: "/poll",
    type: "project.wiktrek.xyz",
  },
  {
    name: "Link shortener",
    description: "URL shortening service",
    url: "/url",
    type: "project.wiktrek.xyz",
  },
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
export function Projects() {
  return (
    <div className="top-16 flex w-full flex-col items-center justify-center text-center">
      <div className="mx-auto grid grid-cols-3 gap-8">
        {projects.map((project) => {
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
      </div>
    </div>
  );
}
function Project(props: ProjectType) {
  const { name, description } = props;
  return (
    // <div className="w-24 rounded-xl border-2 border-border text-xl hover:scale-110">
    //   <p className="text-xl">{name}</p>
    //   <p className="text-base">{description}</p>
    // </div>
    <div className="h-36 w-56 rounded-md bg-transparent p-2 text-left text-xl text-foreground shadow-md transition-all animate-out hover:scale-110 hover:cursor-pointer">
      <a className="text-xl text-primary">{name}</a>
      <p className="px-2 text-base">{description}</p>
    </div>
  );
}
