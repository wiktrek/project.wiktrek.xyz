import { auth, currentUser } from "@clerk/nextjs/server";
import type { Metadata, NextPage } from "next";
import Head from "next/head";
import { api } from "~/trpc/server";
import Link from "next/link";
import { UrlComponent } from "~/app/_components/urlComponent";
const Page: NextPage = async () => {
  const { userId } = auth();
  const user = await currentUser();
  if (!userId || !user) {
    return (
      <h1>
        Loading... If it {"doesn't"} load try{" "}
        <Link href="/sign-in" className="text-ring">
          logging in again
        </Link>
      </h1>
    );
  }
  const data = await api.short.getAllLinks({
    email: user?.primaryEmailAddress!.emailAddress,
  });
  if (!data) {
    return <p>Loading...</p>;
  }
  return (
    <main className="mx-auto flex w-screen flex-col items-center justify-center text-center text-xl text-white">
      <UrlComponent
        email={user.primaryEmailAddress!.emailAddress}
        data={data}
      />
    </main>
  );
};

export default Page;
export const metadata: Metadata = {
  title: "Link shortener - wiktrek.xyz",
  description: "Create short links",
};
