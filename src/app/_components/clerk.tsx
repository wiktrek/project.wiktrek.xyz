"use client";
import { UserButton } from "@clerk/nextjs";
export function ClerkUser() {
  return (
    <div className="animate-fade-in absolute top-12 right-4">
      <UserButton />
    </div>
  );
}
