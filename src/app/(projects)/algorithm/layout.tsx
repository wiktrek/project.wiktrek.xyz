import type { Metadata } from "next";
import Link from "next/link";
interface AlgList {
  categories: {
    name: string;
    algorithms: { name: string; link: string }[];
  }[];
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main>
      <AlgListComponent
        list={{
          categories: [
            {
              name: "Getting Started",
              algorithms: [{ name: "Introduction", link: "#intro" }],
            },
            {
              name: "Basic",
              algorithms: [{ name: "Sorting?", link: "sort" }],
            },
          ],
        }}
      />
      {children}
      <footer></footer>
    </main>
  );
}
export const metadata: Metadata = {
  title: "algorithms - wiktrek.xyz",
  description: "website similar to leetcode/adventofcode",
};
const AlgComponent = (props: { name: string; link: string }) => {
  const { name, link } = props;
  return (
    <div>
      <Link href={"/algorithm/" + link}>{name}</Link>
    </div>
  );
};
const AlgListComponent = (props: { list: AlgList }) => {
  return (
    <div className="top-30 sticky w-80 pl-40">
      <ul className="h-96 rounded-md pl-2 pt-2">
        {props.list.categories.map((category) => (
          <li key={`${category.name}`}>
            <p className="text-lg font-bold">{category.name}</p>
            <ul>
              {category.algorithms.map((algorithm) => (
                <div key={`${algorithm.name}`} className="text-base">
                  <AlgComponent link={algorithm.link} name={algorithm.name} />
                </div>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};
