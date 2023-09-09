import "../styles/globals.css";
import type { AppType }  from 'next/app';
import { trpc } from '../utils/trpc';
import Head from "next/head";
import React from "react";
import Navbar from "../components/navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { createGlobalStyle } from "styled-components";
import { config, dom } from "@fortawesome/fontawesome-svg-core";

config.autoAddCss = false;
const GlobalStyles = createGlobalStyle`
    ${dom.css()}
`;

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>wiktrek.xyz</title>
        <meta
          name="keywords"
          content="wiktrek, wiktrek.xyz, wiktrek website, wiktor, wiktorek, xyz, wiktrek xyz, wiktor, wiktorek, wiktorek website, wiktor website, wiktrek.com, wiktrek.pl, wiktrek.org"
        />
        <meta name="description" content="wiktrek's website" />
        <link rel="icon" href="/favicon.svg" />
      </Head>
      <ClerkProvider {...pageProps}>
        <GlobalStyles />
        <Navbar />
        <Component {...pageProps}/>
      </ClerkProvider>

    </>
  );
}

export default trpc.withTRPC(MyApp);

