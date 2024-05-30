import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { trpc } from "~/utils/trpc";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
import { toast } from "sonner"
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard } from "@fortawesome/free-solid-svg-icons";
const Poll: NextPage = () => {
  const { user } = useUser();
  const { data, isLoading } = trpc.question.getAllMY.useQuery({ email: `${user?.primaryEmailAddress?.emailAddress}` });
  const deleteMutation = trpc.question.deleteQuestion.useMutation()
   
  if (!user)
  {
    return <h1>Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-ring">logging in again</Link></h1>;
  }
  if (!data || isLoading) {
    return <a>Loading...</a>
  }
  const CopyUrl = async (event: React.SyntheticEvent) => {
    const rowId = event.currentTarget.id;
    copy(`https://wiktrek.xyz/q/${rowId}`);
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
                    <FontAwesomeIcon icon={faClipboard} />
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
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
 
  if (!userId) {
      return {
      redirect: {
        destination: '/sign-in',
        permanent: false,
      },
    }
    
  }
 
  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req) } };
};
export default Poll;
