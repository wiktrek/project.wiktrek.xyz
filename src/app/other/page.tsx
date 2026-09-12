import type { NextPage } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

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
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="text-lg font-semibold text-neutral-50">
          projects.wiktrek.xyz
        </Link>
        <nav className="flex items-center gap-5 text-sm text-neutral-300">
          <Link href="/#projects" className="transition hover:text-neutral-50">
            Projects
          </Link>
          <Link href="/other" className="transition hover:text-neutral-50">
            Other
          </Link>
          <a
            href="https://wiktrek.xyz"
            className="hidden transition hover:text-neutral-50 sm:block"
          >
            wiktrek.xyz
          </a>
          <UserButton />
        </nav>
      </header>

      <section className="mx-auto w-full max-w-6xl px-6 py-16 md:px-10 md:py-24">
        <div className="mb-10 flex flex-col items-start gap-2">
          <h2 className="text-3xl font-semibold text-neutral-50 md:text-4xl">
            Other projects
          </h2>
          <p className="max-w-2xl text-sm text-neutral-300 md:text-base">
            Smaller experiments and projects that live outside this site.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Project key={project.url} project={project} />
          ))}
        </div>
      </section>

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 border-t border-white/10 px-6 py-10 text-sm text-neutral-400 md:flex-row md:justify-between md:px-10">
        <p>© {new Date().getFullYear()} wiktrek</p>
        <div className="flex gap-5">
          <a
            href="https://github.com/wiktrek"
            className="transition hover:text-neutral-50"
          >
            GitHub
          </a>
          <Link href="/" className="transition hover:text-neutral-50">
            Projects
          </Link>
          <a
            href="https://wiktrek.xyz"
            className="transition hover:text-neutral-50"
          >
            wiktrek.xyz
          </a>
        </div>
      </footer>
    </div>
  );
};
function Project({ project }: { project: ProjectType }) {
  const className =
    "group relative block overflow-hidden rounded-xl border border-white/10 bg-neutral-900/70 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04)] backdrop-blur transition hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_16px_32px_rgba(0,0,0,0.35)] focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400";
  const content = (
    <>
      <div className="flex items-center justify-between gap-4">
        <p className="text-left text-lg font-semibold text-neutral-50 md:text-xl">
          {project.name}
        </p>
      </div>
      <p className="mt-2 text-left text-sm leading-relaxed text-neutral-300 md:text-base">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="rounded-full border border-amber-300/40 bg-amber-400/10 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-amber-200">
          {project.type === "project.wiktrek.xyz" ? "this site" : "external"}
        </span>
      </div>
    </>
  );
  return project.type === "project.wiktrek.xyz" ? (
    <Link className={className} href={project.url}>
      {content}
    </Link>
  ) : (
    <a className={className} href={project.url}>
      {content}
    </a>
  );
}
export default Home;
