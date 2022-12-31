// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";
import Head from "next/head";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="" />
      </Head>
      <Component {...pageProps} />
    </>
  );
};

export default MyApp;
