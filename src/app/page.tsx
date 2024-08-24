import type { NextPage } from "next";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import React from "react";
const Home: NextPage = () => {
  return (
    <>
      <div className="items-center justify-center overflow-y-hidden bg-background text-center text-3xl font-medium text-ring">
        <div className="absolute right-0">
          <UserButton afterSignOutUrl="/" />
        </div>
        <div>
          <ul className="">
            <li>
              <Link href="/poll">poll app</Link>
            </li>
            <li>
              <Link href="/url">Link shortener</Link>
            </li>
            <li>
              <Link href="/pokemon">pokemon</Link>
            </li>
            <li>
              <a href="https://svelte.wiktrek.xyz">svelte</a>
            </li>
            <li>
              <a href="https://info.wiktrek.xyz">info</a>
            </li>
            <li>
              <a href="https://github.com/wiktrek/password.rs">
                password manager
              </a>
            </li>
            <li>
              <a href="https://github.com/wiktrek/rustapi">rust api</a>
            </li>
            <li>
              <a href="https://github.com/wiktrek/wiktrekbot">wiktrekbot</a>
            </li>
            <li>
              <a href="https://github.com/wiktrek/rust">rust</a>
            </li>
            <li>
              <a href="https://github.com/wiktrek/electron">electron app</a>
            </li>
            <li>
              <Link href="/term">Terminal</Link>
            </li>
            {/* <li>
              <a href="https://three.wiktrek.xyz">three.js</a>
            </li> */}
            <li>
              <Link href="/calculator">calculator</Link>
            </li>
            <li>
              <Link href="/rps">rock paper scissors</Link>
            </li>
            <li>
              <Link href="/rng">random number generator</Link>
            </li>
            <li>
              <Link href="/teamgenerator">team generator</Link>
            </li>
            <li>
              <a href="https://github.com/wiktrek/better-code-editor">
                better code editor
              </a>
            </li>
            <li>
              <h1 className="pt-4">future Projects</h1>
            </li>
            <li>
              {/* <Link href="/projects/recipe"> */}
              <a>Recipe</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;
