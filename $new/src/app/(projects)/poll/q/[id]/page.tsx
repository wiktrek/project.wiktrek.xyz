/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { api as trpc} from "~/trpc/server"
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
import { VoteOn} from "~/app/_components/pollComponents";
import { User, currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";
// import { atomWithStorage } from 'jotai/utils'
// import { useAtom } from "jotai";
// const tokenAtom = atomWithStorage('voterToken', "no-token")
interface Data {
    votes: {
        count: number;
    }[];
    question: {
        id: number;
        createdAt: string | null;
        endsAt: string | null;
        question: string;
        options: unknown;
        ownerEmail: string;
        end: boolean;
    };
    vote: {
        id: number;
        createdAt: string | null;
        questionId: number;
        voterToken: string;
        choice: number;
    };
    isOwner: boolean;
};
const QuestionPageContent: React.FC<{
  id: number;
  data: Data;
  email: string;
  token: string;
}> = async ({ id, email, data, token }) => {
  let isOwner = false;
  let totalVotes = 0;

  if (!data?.question || !data) {
    return <div>Question not found</div>;
  }
  interface Choice {
    count: number;
  }
  const getTotalVotes = (votes: Choice[]) => {
    votes?.map((choice: { count: number }) => {
      
      totalVotes += Number(choice.count);
    
    });
  };
  const getPercent = (voteCount: any) => {
    
    if (
      (voteCount !== undefined && totalVotes > 0) )
      return `${((voteCount / totalVotes) * 100).toFixed()}%`;
    else if (voteCount == undefined) return `0%`;
  };
  if (data && data != undefined) getTotalVotes(data.votes as Choice[]);
  if (email  === data.question?.ownerEmail) isOwner = true;
  return (
    <>
      <Head>
        <meta name="description" content={data.question.question} />
      </Head>
      <main className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl text-white">
        <div className="">
          {isOwner && <p>This is your poll</p>}
          <div className="">
            <a>{data.question?.question}</a>
            {(data.question?.options as {text: string}[])?.map((option, index) => {
              if (isOwner || data.vote) {
                return (
                  <div className="" key={index}>
                    <a>
                      {getPercent(data?.votes?.[index]?.count ?? 0)} {` `}
                      {option.text} -{" "}
                      {data?.votes?.[index]?.count ?? 0} {` `}
                    </a>
                  </div>
                );
              }
              return (
                <div className="" key={index}>
                  <VoteOn questionId={data.question.id} option={index} token={token}/>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};
export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const user = await currentUser()
  if (!id || typeof id !== "number") {
    return <div>No ID</div>;
  }
  const email = user!.primaryEmailAddress!.emailAddress
  const token = "testtoken"
  const data = await trpc.question.getById({
    id, 
    token,
    email
  })
  return (
    <>
      <QuestionPageContent id={id} email={email} data={data as Data} token={token}/>
    </>
  );
};
// export function getVoterToken(): string {
//     if (!localStorage.getItem("voterToken")) {
//       localStorage.setItem("voterToken", uuidv4());
//     }
//     const token = `${localStorage.getItem("voterToken")}`;
//     return token;
// }