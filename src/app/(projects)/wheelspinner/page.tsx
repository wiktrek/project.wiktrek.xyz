// "use client"
// /*

// I will finish this sometime in the future

// */
import type { NextPage } from "next";
// import Head from "next/head";
// import React from "react";
// import { useState } from "react";
// import { Textarea } from "~/app/_components/ui/textarea"
// import { Button } from "~/app/_components/ui/button"
// import Wheel from "~/app/_components/wheel";
// const Page: NextPage = () => {
//   const [texts, setTexts] = useState(["text"] as string[]);
//   const [result, setResult] = useState(0);
//   return (
//     <> 
//       <Head>
//         <title>Wheel spinner- wiktrek</title>
//         <meta name="description" content="Rock paper scissors" />
//       </Head>
//       <div className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl">
//         <div>wheel</div>
//         <div className="">
//             <Textarea className="w-80 h-64" onChange={(e) => {
//                 setTexts(e.target.value.split("\n"));
//               }}
//             >{texts}</Textarea>
//         </div>
//         <Button onClick={() => {
//             setResult(random(0, texts.length - 1))
//             const canvas = document.getElementById("myCanvas");
//             if (!canvas) return <a>no canvas</a>
//             const ctx = canvas.getContext("2d");
//             ctx.beginPath();
//             ctx.arc(95, 50, 40, 0, 2 * Math.PI);
//             ctx.stroke();
//             ctx.strokeStyle = "red"
//         }}>Spin</Button>
//         <Wheel texts={texts} />
//         {texts[result]}{result}
//         <canvas id="myCanvas"></canvas>
//       </div>
//     </>
//   );
// };
const Page: NextPage = () => {

return (
    <a>No</a>
)
}
export default Page;

// function random(min: number, max: number): number {
//   return Math.floor(Math.random() * (max - min + 1) + min);
// }