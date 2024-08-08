"use client";
import { api as trpc } from "~/trpc/react";
export default function Page({ params }: { params: { id: string } }) {
  const { data } = trpc.recipe.getById.useQuery({
    id: Number(params.id),
  });
  if (!data) return <p>Recipe not found</p>;
  return (
    <>
      <main className="flex items-center justify-center text-center text-4xl">
        <a>{params.id}</a>
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
