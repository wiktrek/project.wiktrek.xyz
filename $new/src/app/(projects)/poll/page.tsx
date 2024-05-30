import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { api as trpc} from "~/trpc/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { toast } from "sonner"
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition, faClipboard } from "@fortawesome/free-solid-svg-icons";
const Page: NextPage = async () => {
  const { userId} = auth();
  if (!userId)
  {
    return <h1>Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-ring">logging in again</Link></h1>;
  }
  const user = await currentUser()
  const data = await trpc.question.getAllMY({ email: `${user?.primaryEmailAddress?.emailAddress}` });
  const deleteMutation = trpc.question.deleteQuestion.useMutation()
  if (!data) {
    return <a>Loading...</a>
  }  
  
  const CopyUrl = async (event: React.SyntheticEvent) => {
    const rowId = event.currentTarget.id;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    copy(`https://wiktrek.xyz/q/${rowId}`);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    toast("Link copied!")
  };
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
                  <Link href={`/projects/poll/q/${question.id}`}>
                    <p>{question.question}</p>
                  </Link>
                  <button className="pl-2 pr-1" onClick={CopyUrl} id={`${question.id}`}>
                    <FontAwesomeIcon icon={faClipboard}/>
                  </button>
                  <button
                    className="text-lg"
                    onClick={() => {
                      deleteMutation.mutate({
                        id: question.id,
                      });
                    }}
                  >
                    Delete
                  </button>
                  </ul>
                </div>
              );
            })}
          </div>
          <Link href="/projects/poll/create">
            <button className="w">Create new poll</button>
          </Link>
        </div>
    </>
  );
};
export default Page;