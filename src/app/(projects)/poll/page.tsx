import type { Metadata, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { api as trpc } from "~/trpc/server";
import { DeletePoll } from "~/app/_components/pollComponents";
import { auth } from "@clerk/nextjs/server";
import { Toaster } from "~/app/_components/ui/sonner";
import { ClerkUser } from "~/app/_components/clerk";
const Page: NextPage = async () => {
  const { userId, redirectToSignIn } = await auth();
  if (!userId) return redirectToSignIn();
  const data = await trpc.question.getAllMY();
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main className="items-center justify-center text-center text-2xl">
      <ClerkUser />
      <div className="">
        {data.map((question) => {
          return (
            <div key={question.id} className="p-2">
              <ul className="inline-flex items-center space-x-4">
                <Link href={`/poll/q/${question.id}`} className="">
                  <p className="text-primary text-2xl font-bold">
                    {question.question}
                  </p>
                </Link>
                <DeletePoll id={question.id} />
              </ul>
            </div>
          );
        })}
      </div>
      <Link href="/poll/create">
        <button className="font-bold hover:cursor-pointer">
          Create new poll
        </button>
      </Link>
      <Toaster />
    </main>
  );
};
export default Page;
export const metadata: Metadata = {
  title: "Poll - wiktrek.xyz",
  description: "Create polls",
};
