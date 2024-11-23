"use client";
import type { NextPage } from "next";
import Link from "next/link";
interface AlgList {
  categories: {
    name: string;
    algorithms: { name: String; link: String }[];
  }[];
}
const Home: NextPage = () => {
  return (
    <main className="flex flex-col items-center justify-center text-left">
      <section id="intro" className="w-[80vh] text-left">
        <p className="text-3xl font-semibold">
          This is a guide how I learned how to solve problems
        </p>
        <ul className="inline-block pl-16 text-left text-2xl font-semibold">
          <li>
            <p className="text-xl font-bold">Setup</p>
            <ul className="pl-16 text-lg font-normal">
              <li>
                <Link href="/algorithm/#editor">Editor</Link>
              </li>
              <li>Language</li>
              <li></li>
            </ul>
          </li>
          <li>
            <p className="text-xl font-bold">Basics</p>
            <ul className="text-lg font-semibold">
              <li>
                <ul className="pl-16 text-lg font-normal">
                  <li>Pseudocode</li>
                  <li>Block diagram</li>
                </ul>
              </li>
            </ul>
          </li>
        </ul>
      </section>
      <section id="editor" className="w-[80vh] pt-16 text-left">
        <p className="text-3xl font-bold">What editor should I use?</p>
        <p className="text-2xl">There are many different text editors like</p>
        <ul className="pl-16 text-xl">
          <li>
            <a href="https://code.visualstudio.com/" target="_blank">
              Visual Studio Code
            </a>
          </li>
          <li>
            <a href="https://neovim.io/" target="_blank">
              Neovim
            </a>
          </li>
          <li>
            <a href="https://zed.dev/" target="_blank">
              Zed
            </a>
          </li>
          <li>
            <a href="https://www.sublimetext.com/" target="_blank">
              Sublime Text
            </a>
          </li>
          <li>
            <a href="https://atom.io/" target="_blank">
              Atom
            </a>
          </li>
        </ul>
        <p className="text-2xl">
          In my opinion you should use the one you like the most.
        </p>
      </section>
      <section id="language" className="w-[80vh] pt-16">
        <p className="text-3xl font-bold">
          What programming language should I learn?
        </p>
        <p className="text-2xl">
          There are many different programming languages like
        </p>
        <ul className="text-normal pl-16">
          <li>Python</li>
          <li>JavaScript</li>
          <li>C++</li>
          <li>Java</li>
          <li>C#</li>
          <li>Rust</li>
          <li>Go</li>
          <li>Swift</li>
          <li>Ruby</li>
        </ul>
        <p className="text-2xl">
          And many other ones. For learning algorithms I would recommend using{" "}
          <a href="https://www.python.org/" className="text-accent underline">
            python
          </a>{" "}
          because it has a really simple{" "}
          <a
            href="https://en.wikipedia.org/wiki/Syntax_(programming_languages)"
            className="text-accent underline"
          >
            syntax
          </a>{" "}
          and there are many resources for learning it.
        </p>
      </section>
    </main>
  );
};
export default Home;
