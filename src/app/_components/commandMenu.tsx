"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
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
  { name: "Todo board", url: "/todo" },
  {
    name: "Poll",
    url: "/poll",
  },
  { name: "Recipes", url: "/recipe" },
  { name: "Team generator", url: "/teamgenerator" },
  { name: "Other projects", url: "/other" },
  {
    name: "Link shortener",
    url: "/url",
  },
  {
    name: "Rock paper scissors",
    url: "/rps",
  },
];
export const CommandMenu = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [pendingGo, setPendingGo] = useState(false);
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isTyping =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      if (isTyping) return;

      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setOpen(true);
        return;
      }

      if (pendingGo) {
        const destinations: Record<string, string> = {
          h: "/",
          o: "/other",
          t: "/todo",
          p: "/poll",
          r: "/recipe",
          l: "/link",
          u: "/url",
          m: "/teamgenerator",
        };
        const destination = destinations[e.key.toLowerCase()];
        setPendingGo(false);
        if (destination) {
          e.preventDefault();
          router.push(destination);
        }
        return;
      }

      if (e.key.toLowerCase() === "g") {
        setPendingGo(true);
        window.setTimeout(() => setPendingGo(false), 1200);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [pendingGo, router]);
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
            Main page <CommandShortcut>g h</CommandShortcut>
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
                {name === "Todo board" && (
                  <CommandShortcut>g t</CommandShortcut>
                )}
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
