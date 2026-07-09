import { CommandMenu } from "~/app/_components/commandMenu";
import Navbar from "~/app/_components/navbar";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CommandMenu />
      <Navbar />
      {children}
    </>
  );
}
