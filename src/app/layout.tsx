import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";
import { TRPCReactProvider } from "~/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Provider } from "jotai";
export const metadata = {
  title: "projects - wiktrek.xyz",
  description: "Wiktrek's projects",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <ClerkProvider>
          <Provider>
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </Provider>
        </ClerkProvider>
      </body>
    </html>
  );
}
