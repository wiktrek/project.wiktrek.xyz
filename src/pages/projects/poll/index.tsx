import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import {
  useUser,
  UserProvider,
  withPageAuthRequired,
} from "@auth0/nextjs-auth0";
import { trpc } from "../../../utils/trpc";
const Poll: NextPage = () => {
  const { user } = useUser();

  const { data, isLoading } = trpc.useQuery([
    "questions.get-all-my",
    { email: `${user?.name}` },
  ]);
  if (!user) return <a>No email</a>;
  if (isLoading || !data) return <div>Loading...</div>;

  return (
    <>
      <UserProvider>
        <Head>
          <title>Poll - wiktrek</title>
          <meta name="description" content="Polls" />
        </Head>
        <div className="">
          <div className="">
            {data.map((question) => {
              return (
                <div key={question.id} className="{styles.question}">
                  <Link href={`/projects/poll/q/${question.id}`}>
                    <p>{question.question}</p>
                  </Link>
                  <span>
                    Created at {new Date(question.createdAt).toDateString()}
                  </span>
                </div>
              );
            })}
          </div>
          <Link href="/projects/poll/create">
            <button className="w">Create new poll</button>
          </Link>
        </div>
      </UserProvider>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = withPageAuthRequired({});
export default Poll;
