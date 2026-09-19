import React from "react";
// import { api as trpc } from "~/trpc/server";
import { FormComponent } from "~/app/_components/pollComponents";
import Head from "next/head";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Toaster } from "~/app/_components/ui/sonner";
import { ClerkUser } from "~/app/_components/clerk";
const QuestionCreator: React.FC = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  return (
    <>
      <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
        <ClerkUser />
        <div className="w-full max-w-2xl px-4 py-12 sm:py-20">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">Poll studio</p>
          <h1 className="mb-10 text-left text-4xl font-semibold tracking-tight">Ask better questions.</h1>
          <FormComponent />
        </div>
        <Toaster />
      </main>
    </>
  );
};
export default QuestionCreator;
export const metadata: Metadata = {
  title: "Create poll - wiktrek.xyz",
  description: "Create polls",
};
