import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useUser } from "@clerk/nextjs";
import { trpc } from "~/utils/trpc";
import { buildClerkProps, getAuth } from "@clerk/nextjs/server";
const Recipe: NextPage = () => {
  const { user } = useUser();
  const { data, isLoading } = trpc.recipe.getAllMY.useQuery({ email: `${user?.primaryEmailAddress?.emailAddress}` });
  if (!user)
  {
    return <h1>Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-[#767dc1]">logging in again</Link></h1>;
  }
  if (!data || isLoading) {
    return <a>Loading...</a>
  }
  return (
    <>
        <Head>
          <title>Recipe - wiktrek</title>
          <meta name="description" content="Polls" />
        </Head>
        <div className="items-center justify-center text-center">
         <a>Create recipe</a> 
        </div>
    </>
  );
};
export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { userId } = getAuth(ctx.req);
 
  if (!userId) {
    // handle user is not logged in.
  }
 
  // Load any data your application needs for the page using the userId
  return { props: { ...buildClerkProps(ctx.req) } };
};
export default Recipe;


