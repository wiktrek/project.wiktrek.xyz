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
    <main className="items-center justify-center text-center">
      <div className="text-2xl">
        <p>
          <Link href="/algorithm/#algs" className="font-bold text-accent">
            This
          </Link>{" "}
          is a list of algorithms I've learned
        </p>
      </div>
      <section id="algs" className="text-left">
        <AlgListComponent
          list={{
            categories: [
              {
                name: "Basic",
                algorithms: [{ name: "quicksort", link: "quicksort" }],
              },
            ],
          }}
        />
      </section>
    </main>
  );
};
const AlgComponent = (props: { name: String }) => {
  const { name } = props;
  return (
    <div>
      <p>{name}</p>
    </div>
  );
};
const AlgListComponent = (props: { list: AlgList }) => {
  return (
    <div>
      <ul className="border- rounded border-2">
        {props.list.categories.map((category) => (
          <li key={`${category.name}`}>
            <p className="text-md font-bold">{category.name}</p>
            <ul>
              {category.algorithms.map((algorithm) => (
                <p key={`${algorithm.name}`} className="text-sm">
                  {algorithm.name}
                </p>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
export default Home;
