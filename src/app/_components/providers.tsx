import { ClerkProvider } from "@clerk/nextjs";
import { TRPCReactProvider } from "~/trpc/react";

// Kept out of the root layout so static pages (/, /other) don't ship Clerk or tRPC.
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <TRPCReactProvider>{children}</TRPCReactProvider>
    </ClerkProvider>
  );
}
