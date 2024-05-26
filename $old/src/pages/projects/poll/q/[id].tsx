/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRouter } from "next/router";
import React from "react";
import type { NextPage } from "next";
import { trpc } from "../../../../utils/trpc";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useUser } from "@clerk/nextjs";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { v4: uuidv4 } = require("uuid");
const QuestionPageContent: React.FC<{
  id: number;
  token: string;
  email: string;
}> = ({ id, token, email }) => {
  const { user } = useUser();
  let isOwner = false;
  let totalVotes = 0;
  // const { data, isLoading } = trpc.useQuery([
  //   "questions.get-by-id",
  //   { id, token, email },
  // ]);
  const { data, isLoading } = trpc.question.getById.useQuery({
    id, 
    token, 
    email
  })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const voteOnMutation  = trpc.question.voteOn.useMutation({
    onSuccess() { 
      window.location.reload()
    }
  }) 
  // const { mutate, data: voteResponse } = trpc.useMutation(
  //   "questions.vote-on-question",
  //   {
  //     onSuccess: () => window.location.reload(),
  //   }
  // );

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (!data || !data?.question) {
    return <div>Question not found</div>;
  }
  const getTotalVotes = (votes: any) => {
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
  if (data && data != undefined) getTotalVotes(data.votes);
  if (user?.primaryEmailAddress?.emailAddress  === data.question?.ownerEmail) isOwner = true;
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
            {(data.question?.options as string[])?.map((option, index) => {

              if (isOwner || data.vote) {
                return (
                  <div className="" key={index}>
                    <a>
                      {getPercent(data?.votes?.[index]?.count ?? 0)} {` `}
                      {(option as any).text} -{" "}
                      {data?.votes?.[index]?.count ?? 0} {` `}
                    </a>
                  </div>
                );
              }
              return (
                <div className="" key={index}>
                  <button
                    onClick={() => {
                      voteOnMutation.mutate({
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        questionId: data.question!.id,
                        option: index,
                        token: token,
                      });
                    }}
                  >
                    {(option as any).text}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </>
  );
};
const QuestionPage: NextPage = () => {
  const [token, setToken] = useState("");
  const { query } = useRouter();
  const id  = Number(query.id);
  const { user } = useUser();
  useEffect(() => {
    if (!localStorage.getItem("voterToken")) {
      localStorage.setItem("voterToken", uuidv4());
    }
    setToken(`${localStorage.getItem("voterToken")}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (!id || typeof id !== "number") {
    return <div>No ID</div>;
  }
  return (
    <>
      <QuestionPageContent id={id} token={token} email={`${user?.primaryEmailAddress?.emailAddress}`} />
    </>
  );
};
export default QuestionPage;
