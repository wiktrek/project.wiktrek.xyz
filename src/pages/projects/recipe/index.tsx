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
    return <h1>Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-ring">logging in again</Link></h1>;
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
         <a>Recipe</a>
         {data.map((e: { name: string, id: number }) => {
          return (
        <p key="e">
          <Link href={`/projects/recipe/r/${e.id}`}>
          {e.name}
            </Link></p>)
})}
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
export default Recipe;

