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
    <main className="flex flex-col items-center justify-center border border-red-900 text-center">
      <section id="intro">
        <p className="text-3xl font-semibold">
          This is a guide how I learned how to solve problems
        </p>
        <ul className="inline-block text-left text-2xl font-semibold">
          <li>
            <p className="text-xl font-bold">Setup</p>
            <ul className="text-lg font-normal">
              <li>Editor</li>
              <li>Language</li>
              <li></li>
            </ul>
          </li>
          <li>
            <p className="text-xl font-bold">Basics</p>
            <ul className="text-lg font-semibold">
              <li>
                <ul className="text-base font-normal">
                  <li>pseudocode</li>
                  <li>block diagram</li>
                </ul>
              </li>
              <li>Ways to learn</li>
              <li></li>
            </ul>
          </li>
        </ul>
      </section>
      <section id="editor" className="pt-96">
        <ol className="text-left text-3xl">
          <li>
            <p>What editor should I use?</p>
            <p className="text-2xl">
              There are many different text editors like
            </p>
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
          </li>
        </ol>
      </section>
    </main>
  );
};
export default Home;
