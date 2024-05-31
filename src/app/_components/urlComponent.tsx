"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faClipboard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Input } from "~/app/_components/ui/input"
import { toast } from "sonner"
import copy from "copy-to-clipboard";
import { api as trpc } from "~/trpc/react";
import Link from "next/link";
export function UrlComponent(props: {email: string, data: {
    slug: string,
    url: string,
    id: number,
    owner: string,
}[]
}) {
  const { email, data } = props;
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
//   const [newError, setError] = useState("");

  const removeMutation = trpc.short.removeSlug.useMutation();
  const createMutation = trpc.short.createSlug.useMutation(); 

console.log(slug, url, email);
  const CopyUrl = (slug: string) => {
    copy(`https://wiktrek.xyz/go/${slug}/`);
    toast("Link copied!")
  };
  function reload() {
    window.location.reload();
  }

  const DeleteFunction = (slug: string) => {
      removeMutation.mutate({ slug });

    return reload();
  };
  const submitData = async (e: React.SyntheticEvent) => {
    if (slug === "" || url === "") return;
    // console.log(slug, url, user);
    e.preventDefault();
    createMutation.mutate({
       slug: slug,
       url: url, 
       email: email
      })
  toast("Slug has been created.")
  };
  if (!email)
  {
    return <h1 className="text-3xl">Loading... If it {"doesn't"} load try  <Link href="/sign-in" className="text-ring font-bold">logging in again</Link></h1>;
  }
return (
  <>
          <div>
            <h1>create new short url</h1>
            <form onSubmit={submitData} className="">
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
              <button type="submit" className="text-ring">
                Create
              </button>
            </form>
            {/* <a>{newError}</a> */}
          </div>
          <div className="">
            <table className="">
              <tbody>
                {data?.map((item: { slug: string}, index: number) => {
                  return (
                    <>
                      <div className="" id={item.slug}>
                        {index + 1 + " "}
                        {item.slug}
                        <button className="px-1" onClick={() => {CopyUrl(item.slug)}}>
                          <FontAwesomeIcon icon={faClipboard} />
                        </button>
                        <button onClick={() => {DeleteFunction(item.slug)}} data-slug={item.slug}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </>
                  );
                })}
              </tbody>
            </table>
            <Link href="/api/auth/logout" className="text-ring font-semibold">logout</Link>
          </div>
          </>
)
}