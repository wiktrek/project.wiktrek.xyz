import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "algorithms - wiktrek.xyz",
  description: "website similar to leetcode/adventofcode",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return <section>{children}</section>;
}
