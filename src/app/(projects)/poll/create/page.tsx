import React from "react";
// import { api as trpc } from "~/trpc/server";
import { FormComponent } from "~/app/_components/pollComponents";
import Head from "next/head";
import Link from "next/link";

import { auth, currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
const QuestionCreator: React.FC = async () => {
  const { userId } = auth();
  if (!userId) {
    return (
      <h1>
        Loading... If it {"doesn't"} load try{" "}
        <Link href="/sign-in" className="text-ring">
          logging in again
        </Link>
      </h1>
    );
  }
  const user = await currentUser();
  // const data = await trpc.question.getAllMY({ email: `${user?.primaryEmailAddress?.emailAddress}` });
  if (!user) {
    return (
      <h1>
        Loading... If it {"doesn't"} load try{" "}
        <Link href="/sign-in" className="text-ring">
          logging in again
        </Link>
      </h1>
    );
  }
  return (
    <>
      <Head>
        <title>Poll create- wiktrek</title>
        <meta name="description" content="create a poll" />
      </Head>
      <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
        <FormComponent email={user.primaryEmailAddress!.emailAddress} />
      </main>
    </>
  );
};
export default QuestionCreator;
export const metadata: Metadata = {
  title: "Poll - wiktrek.xyz",
  description: "Create polls",
};
