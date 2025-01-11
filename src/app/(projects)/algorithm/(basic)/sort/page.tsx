"use client";
import type { NextPage } from "next";
// import Link from "next/link";
// import SyntaxHighlighter from "react-syntax-highlighter";
// import { darcula } from "react-syntax-highlighter/dist/esm/styles/hljs";
const Home: NextPage = () => {
  //   const bubble_sort = `#python code
  //   def bubble_sort(arr):
  //     n = len(arr)
  //     for i in range(n):
  //         swapped = False
  //         for j in range(0, n-i-1):

  //             if arr[j] > arr[j+1]:
  //                 arr[j], arr[j+1] = arr[j+1], arr[j]
  //                 swapped = True
  //         if not swapped:
  //             break
  // arr = [5,4,3,2,1,10,9,8,7,6]
  // bubble_sort(arr)
  // print("sorted:", arr)`;
  return (
    <main className="flex items-center justify-center text-center">
      <div className="text-left text-2xl">
        <p className="text-3xl font-bold">What is sorting?</p>
        <p>
          Sorting refers to rearrangement of a given array or list of elements
          according to a comparison operator on the elements.{" "}
        </p>
        <p className="text-3xl font-bold">How does it work?</p>
        <p>
          The algorithm goes through an array and checks if the next elements
          are smaller. If an element is smaller they are swapped
        </p>
        <p className="text-3xl font-bold">Example</p>
        <div className="flex flex-col items-center justify-center gap-y-1 text-center">
          <p>We have an array: [3,2,1]</p>
          <div className="flex gap-4">
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              3
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              2
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              1
            </p>
          </div>
          <p>j = 0</p>
          <p>arr[j] &gt; arr[j+1] -&gt; swap</p>
          arr[0] is 3 and arr[0+1] is 2 -&gt; 3 is bigger than 2- &gt; we swap 3
          and 2
          <div className="flex gap-4 pt-4">
            <p className="h-16 w-16 content-center rounded-lg bg-primary text-center font-bold">
              3
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-primary-500 text-center font-bold">
              2
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              1
            </p>
          </div>
          j = 1 arr[1] &gt; arr[1 + 1] -&gt; 3 is bigger than 1 -&gt; swap
          <div className="flex gap-4 pt-4">
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              2
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-primary text-center font-bold">
              3
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-primary-500 text-center font-bold">
              1
            </p>
          </div>
          j = 0 arr[0] &gt; arr[0 + 1] -&gt; 2 is bigger than 1 -&gt; swap
          <div className="flex gap-4 pt-4">
            <p className="h-16 w-16 content-center rounded-lg bg-primary text-center font-bold">
              2
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-primary-500 text-center font-bold">
              1
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              3
            </p>
          </div>
          Result:
          <div className="flex gap-4">
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              1
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              2
            </p>
            <p className="h-16 w-16 content-center rounded-lg bg-secondary text-center font-bold">
              3
            </p>
          </div>
          <a
            href="https://algorithm-visualizer.org/brute-force/bubble-sort"
            target="_blank"
            className="font-bold text-accent underline"
          >
            Animated visualization
          </a>
        </div>
        <p className="text-3xl font-bold">Python code</p>
        {/* <SyntaxHighlighter language="python" style={darcula}>
          {bubble_sort}
        </SyntaxHighlighter> */}
      </div>
    </main>
  );
};
export default Home;
