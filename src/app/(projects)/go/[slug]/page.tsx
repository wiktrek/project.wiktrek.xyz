// import { NextApiRequest, NextApiResponse } from "next";
// import { trpc } from "../../utils/trpc";
// import { useRouter } from "next/router";
// export default function Page() {
//   const router = useRouter();
//   if (router.query.slug == null ) return;
//   const slug = router.query.slug as string;

//   const { data } = trpc.short.getSlug.useQuery({
//     slug: slug,
//   });
//   if (!data) return <p>Slug not found</p>;
//   router.push(data?.s?.url as string);

//   return <p>redirecting...</p>;
// }
"use client";
import { api as trpc } from "~/trpc/react";
import { useRouter } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = await params;
  const { data } = trpc.short.getSlug.useQuery({
    slug,
  });

  if (!data?.s?.url || data.s.url == undefined) return <p>Slug not found</p>;
  router.push(data?.s?.url);
  return <p>redirecting...</p>;
}
