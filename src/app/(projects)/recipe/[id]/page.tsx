"use client";
import { api as trpc } from "~/trpc/react";
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { data } = trpc.recipe.getById.useQuery({
    id: Number((await params).id),
  });
  if (!data) return <p>Recipe not found</p>;
  return (
    <>
      <main className="flex items-center justify-center text-center text-4xl">
        <p>{(await params).id}</p>
      </main>
    </>
  );
}

// export default function Page({ params }: { params: { slug: string } }) {
//   const router = useRouter();
//   const { slug }= params
//   const { data } = trpc.short.getSlug.useQuery({
//     slug
//   })

//   if (!data?.s?.url || data.s.url == undefined) return <p>Slug not found</p>;
//   router.push(data?.s?.url);
//   return <p>redirecting...</p>;
// }
