import type { NextPage } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { Projects } from "~/app/_components/projects";

const Home: NextPage = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-6 md:px-10">
        <Link href="/" className="text-lg font-semibold text-neutral-50">
          projects.wiktrek.xyz
        </Link>
        <nav className="flex items-center gap-5 text-sm text-neutral-300">
          <a href="#projects" className="transition hover:text-neutral-50">
            Projects
          </a>
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

      <Projects />

      <footer className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3 border-t border-white/10 px-6 py-10 text-sm text-neutral-400 md:flex-row md:justify-between md:px-10">
        <div className="flex gap-5">
          <a
            href="https://github.com/wiktrek"
            className="transition hover:text-neutral-50"
          >
            GitHub
          </a>
          <Link href="/other" className="transition hover:text-neutral-50">
            Other projects
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

export default Home;
