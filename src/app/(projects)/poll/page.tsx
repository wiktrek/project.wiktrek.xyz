import type { Metadata, NextPage } from "next";
import Link from "next/link";
import React from "react";
import { api as trpc } from "~/trpc/server";
import { DeletePoll } from "~/app/_components/pollComponents";
import { auth, currentUser } from "@clerk/nextjs/server";

const Page: NextPage = async () => {
  const { userId } = await auth();
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
              <ul className="inline-flex">
                <Link href={`/poll/q/${question.id}`}>
                  <p>{question.question}</p>
                </Link>

                <DeletePoll id={question.id} />
              </ul>
            </div>
          );
        })}
      </div>
      <Link href="/poll/create">
        <button className="w">Create new poll</button>
      </Link>
    </main>
  );
};
export default Page;
export const metadata: Metadata = {
  title: "Poll - wiktrek.xyz",
  description: "Create polls",
};
