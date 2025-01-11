import { Metadata } from "next";

export const metadata: Metadata = {
  title: "aim - wiktrek.xyz",
  description: "aim",
};
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
