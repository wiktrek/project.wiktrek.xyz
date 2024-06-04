"use client"
import Link from "next/link"
import { useEffect, useState } from "react"
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
} from "~/app/_components/ui/command"
export const CommandMenu = () => {
   const [open, setOpen] = useState(false)
   useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
        }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])
  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
     <CommandInput placeholder="Type a command or search..." />
     <CommandList>
      <CommandEmpty>No results found.</CommandEmpty>
       <CommandGroup heading="Suggestions">
       <CommandItem>
        <Link href="/help">Calendar
        </Link></CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>Profile</CommandItem>
        <CommandItem>Billing</CommandItem>
        <CommandItem>Settings</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandDialog>
)
}