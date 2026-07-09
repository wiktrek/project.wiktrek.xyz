import "~/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";

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
        <ClerkProvider>
          <TRPCReactProvider>{children}</TRPCReactProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
