import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";

import React from "react";
const Home: NextPage = () => {

  return (
    <>
      <Head>
        <title>Projects - wiktrek.xyz</title>
        <meta name="description" content="wiktrek's projects" />
      </Head>
      <div className=" items-center justify-center text-center text-[#0cabc0] text-2xl">
      
        <div>
          <ul className="">
            <li>
              <a href="https://github.com/wiktrek/better-code-editor">
                better code editor
              </a>
            </li>
            <li>
              <Link href="/projects/poll">
                poll app
              </Link>
            </li>
            <li>
              <Link href="/projects/url">Link shortener</Link>
            </li>
            <li>
              <Link href="/projects/pokemon">pokemon</Link>
            </li>
            <li>
              <a href="https://svelte.wiktrek.xyz">svelte</a>
            </li>
            <li>
              <a href="https://rust.wiktrek.xyz">rust api</a>
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
              <a href="https://info.wiktrek.xyz">info</a>
            </li>
            <li>
              <a href="https://term.wiktrek.xyz">Terminal</a>
            </li>
            <li>
              <a href="https://three.wiktrek.xyz">three.js</a>
            </li>

            <li>
              <Link href="/projects/calculator">calculator
              </Link>
            </li>
            <li>
              <Link href="/projects/rps">
                rock paper scissors
              </Link>
            </li>
            <li>
              <Link href="/projects/rng">
                random number generator
              </Link>
            </li>
            <h1 className="pt-4">future Projects</h1>
            <li>
              {/* <Link href="/projects"> */}
              <a> Wheel Spinner</a>
              {/* </Link> */}
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Home;

