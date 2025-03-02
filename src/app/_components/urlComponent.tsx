"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { faClipboard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Input } from "~/app/_components/ui/input";
import { toast } from "sonner";
import copy from "copy-to-clipboard";
import { api as trpc } from "~/trpc/react";
import Link from "next/link";

import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import TryLoggingIn from "./try";
export function UrlComponent(props: {
  email: string;
  data: {
    slug: string;
    url: string;
    id: number;
    owner: string;
  }[];
}) {
  const { email, data } = props;
  const [slug, setSlug] = useState("");
  const [url, setUrl] = useState("");
  //   const [newError, setError] = useState("");

  const removeMutation = trpc.short.removeSlug.useMutation();
  const createMutation = trpc.short.createSlug.useMutation();

  const CopyUrl = (slug: string) => {
    copy(`https://wiktrek.xyz/go/${slug}/`);
    toast("Link copied!");
  };
  const submitData = async (e: React.SyntheticEvent) => {
    if (slug === "" || url === "") return;
    e.preventDefault();
    createMutation.mutate({
      slug: slug,
      url: url,
      email: email,
    });
    toast("Slug has been created.");
  };
  if (!email) {
    return <TryLoggingIn />;
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
        <ul className="">
          {data?.map((item: { slug: string }, index: number) => {
            return (
              <li key={item.slug}>
                <div className="" id={item.slug}>
                  {index + 1 + " "}
                  {item.slug}
                  <button
                    className="px-1"
                    onClick={() => {
                      CopyUrl(item.slug);
                    }}
                  >
                    <FontAwesomeIcon icon={faClipboard as IconProp} />
                  </button>
                  <button
                    onClick={() => {
                      removeMutation.mutate(
                        { slug: item.slug, email },
                        {
                          onSuccess: () => {
                            toast("Slug has been removed.");
                            window.location.reload();
                          },
                        },
                      );
                    }}
                    data-slug={item.slug}
                  >
                    <FontAwesomeIcon icon={faTrash as IconProp} />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
        <Link href="/api/auth/logout" className="font-semibold text-ring">
          logout
        </Link>
      </div>
    </>
  );
}
