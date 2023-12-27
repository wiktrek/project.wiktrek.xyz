/* eslint-disable */
import { NextApiRequest, NextApiResponse } from "next";
import React, { useState } from "react";
import { getAuth, buildClerkProps } from "@clerk/nextjs/server";
import type { NextPage, GetServerSideProps } from "next";
import Head from "next/head";
import copy from "copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClipboard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { trpc } from "~/utils/trpc";
import { useAuth, useUser } from "@clerk/nextjs";
import { Input } from "~/components/ui/input"
import Link from "next/link";
const Home: NextPage = () => {
    const { isLoaded, isSignedIn, user } = useUser();
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  const [newError, setError] = useState("");

  const removeMutation = trpc.short.removeSlug.useMutation();
  const createMutation = trpc.short.createSlug.useMutation(); 
  const { data } = trpc.short.getAllLinks.useQuery({
  email: user?.primaryEmailAddress?.emailAddress as string
  });
console.log(slug, url, user?.primaryEmailAddress?.emailAddress);
  const CopyUrl = async (event: React.SyntheticEvent) => {
    // @ts-ignore: Object is possibly 'null'.
    const rowId = event.currentTarget.parentNode.id;
    copy(`https://project.wiktrek.xyz/go/${rowId}`);
  };
  function reload() {
    window.location.reload();
  }

  const DeleteFunction = async (event: React.SyntheticEvent) => {
    // @ts-ignore: Object is possibly 'null'.
    const rowId = event.currentTarget.parentNode.id;

    if (typeof rowId === "string") {
      if (rowId === null) return;
      console.log(rowId);
      removeMutation.mutate({ slug: rowId });
    }
    return reload();
  };
  const submitData = async (e: React.SyntheticEvent) => {
    if (slug === "" || url === "") return;
    console.log(slug, url, user);
    e.preventDefault();
    createMutation.mutate({
       slug: slug,
       url: url, 
       email: user?.primaryEmailAddress?.emailAddress as string
      })
      reload()
  };
  if (!user)
  {
    return <h1 className="text-3xl">Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-primary-500 font-bold">logging in again</Link></h1>;
  }
  return (
    <>
      <Head>
        <title>Url shortener - wiktrek.xyz</title>
      </Head>
        <main className="mx-auto flex  w-screen flex-col items-center justify-center text-center text-xl text-white">
          <div>
            <h1>create new short url</h1>
            <Link href="/api/auth/logout">logout</Link>
            <form onSubmit={submitData}>
              <div className="pb-1">
              <Input
                autoFocus
                onChange={(e) => setSlug(e.target.value)}
                placeholder="slug"
                type="text"
                value={slug}
              />
              </div>

              <Input
                type="url"
                onChange={(e) => setUrl(e.target.value)}
                placeholder="url"
                className=""
                value={url}
              />
              <button type="submit" className="">
                Submit
              </button>
            </form>
            <a>{newError}</a>
          </div>
          <div className="">
            <table className="">
              <tbody>
                {data?.map((item: any, index: any) => {
                  return (
                    <>
                      <div className="" id={item.slug}>
                        {index + 1 + " "}
                        {item.slug}
                        {/* url: {item.url} */}
                        <button onClick={CopyUrl}>
                          <FontAwesomeIcon icon={faClipboard} />
                        </button>
                        <button onClick={DeleteFunction} data-slug={item.slug}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        </main>
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

export default Home;
