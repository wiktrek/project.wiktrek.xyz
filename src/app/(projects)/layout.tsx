import { CommandMenu } from "~/app/_components/commandMenu";
import Navbar from "~/app/_components/navbar";
import { Providers } from "~/app/_components/providers";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <CommandMenu />
      <Navbar />
      {children}
    </Providers>
  );
}
