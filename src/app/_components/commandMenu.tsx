"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/app/_components/ui/command";
interface Project {
  name: string;
  url: string;
}
const projects: Project[] = [
  {
    name: "Poll",
    url: "/poll",
  },
  {
    name: "Link shortener",
    url: "/url",
  },
  {
    name: "Calculator",
    url: "/calculator",
  },
  {
    name: "Rock paper scissors",
    url: "/rps",
  },
];
export const CommandMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem
            onSelect={() => {
              router.push("/");
              setOpen(false);
            }}
          >
            Main page
          </CommandItem>
          <CommandItem
            onSelect={() => {
              router.push("https://wiktrek.xyz");
              setOpen(false);
            }}
          >
            Wiktrek.xyz
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />
        <CommandGroup heading="Projects">
          {projects.map(({ name, url }) => {
            return (
              <CommandItem
                key={name}
                onSelect={() => {
                  router.push(url);
                  setOpen(false);
                }}
              >
                {name}
              </CommandItem>
            );
          })}
        </CommandGroup>
        {/* <CommandSeparator />
      <CommandGroup heading="Projects">

      </CommandGroup> */}
      </CommandList>
    </CommandDialog>
  );
};
