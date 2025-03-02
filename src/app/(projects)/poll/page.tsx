import type { Metadata, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { api as trpc } from "~/trpc/server";
import { DeletePoll } from "~/app/_components/pollComponents";
import { auth, currentUser } from "@clerk/nextjs/server";
import TryLoggingIn from "~/app/_components/try";
import { Toaster } from "~/app/_components/ui/sonner";

const Page: NextPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    return <TryLoggingIn />;
  }
  const user = await currentUser();
  const data = await trpc.question.getAllMY({
    email: `${user?.primaryEmailAddress?.emailAddress}`,
  });
  if (!data) {
    return <p>Loading...</p>;
  }

  return (
    <main className="items-center justify-center text-center text-2xl">
      <div className="">
        {data.map((question) => {
          return (
            <div key={question.id} className="p-2">
              <ul className="inline-flex items-center">
                <Link href={`/poll/q/${question.id}`}>
                  <p className="text-2xl font-bold text-primary">
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
        <button className="font-bold">Create new poll</button>
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
