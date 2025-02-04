import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { CommandMenu } from "~/app/_components/commandMenu";
import Navbar from "~/app/_components/navbar";

export const metadata = {
  title: "Projects - wiktrek.xyz",
  description: "Wiktrek's projects",
  keywords: [
    "projects",
    "wiktrek.xyz",
    "poll app",
    "link shortener",
    "wiktrek",
    "wiktor",
    "projekty",
  ],
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body className="bg-background font-sans">
        <CommandMenu />
        <Navbar />
        <ClerkProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
