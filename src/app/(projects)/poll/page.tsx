import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { api as trpc } from "~/trpc/server";
import { DeletePoll } from "~/app/_components/pollComponents";
import { auth, currentUser } from "@clerk/nextjs/server";

const Page: NextPage = async () => {
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
  const data = await trpc.question.getAllMY({
    email: `${user?.primaryEmailAddress?.emailAddress}`,
  });
  if (!data) {
    return <a>Loading...</a>;
  }

  return (
    <>
      <Head>
        <title>Poll - wiktrek</title>
        <meta name="description" content="Polls" />
      </Head>
      <div className="items-center justify-center text-center text-2xl">
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
      </div>
    </>
  );
};
export default Page;
