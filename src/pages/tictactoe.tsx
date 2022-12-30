import type { NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>tictactoe - wiktrek.xyz</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="container mx-auto flex min-h-screen flex-col items-center justify-center p-4">
        <div className="grid grid-cols-3">
          <button className="ttt" id="1">
            {}
          </button>
          <button className="ttt" id="2"></button>
          <button className="ttt" id="3"></button>
          <button className="ttt" id="4"></button>
          <button className="ttt" id="5"></button>
          <button className="ttt" id="6"></button>
          <button className="ttt" id="7"></button>
          <button className="ttt" id="8"></button>
          <button className="ttt" id="9"></button>
        </div>
      </main>
    </>
  );
};

export default Home;
