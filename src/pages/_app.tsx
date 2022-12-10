// src/pages/_app.tsx
import "../styles/globals.css";
import type { AppType } from "next/app";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="" />
      </head>
      <Component className="bg-[url('/bg.png')]" {...pageProps} />;
    </>
  );
};

export default MyApp;
