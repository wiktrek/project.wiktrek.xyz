import React from "react";
// import { api as trpc } from "~/trpc/server";
import { FormComponent } from "~/app/_components/pollComponents";
import Head from "next/head";
import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata } from "next";
import { Toaster } from "~/app/_components/ui/sonner";
import { ClerkUser } from "~/app/_components/clerk";
const QuestionCreator: React.FC = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const user = await currentUser();
  // const data = await trpc.question.getAllMY({ email: `${user?.primaryEmailAddress?.emailAddress}` });
  if (!user) {
    return <p>Loading...</p>;
  }
  return (
    <>
      <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
        <ClerkUser />
        <FormComponent email={user.primaryEmailAddress!.emailAddress} />
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
