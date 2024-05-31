/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { api as trpc} from "~/trpc/server"
import { QuestionPageContent } from "~/app/_components/pollComponents";
import { currentUser } from "@clerk/nextjs/server";
import { v4 as uuidv4 } from "uuid";

export default async function Page({ params }: { params: { id: string } }) {
  const id = Number(params.id)
  const user = await currentUser()
  if (!id || typeof id !== "number") {
    return <div>No ID</div>;
  }
  const email = user?.primaryEmailAddress!.emailAddress ?? "no-email"
  // eslint-disable-next-line react-hooks/rules-of-hooks
  return (
    <>
      <QuestionPageContent email={email} id={id}/>
    </>
  );
};
// export function getVoterToken(): string {

//     return token;
// }
