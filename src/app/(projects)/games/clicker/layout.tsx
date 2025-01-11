import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Clicker - wiktrek.xyz",
  description: "Clicker game",
};
export default function PageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
