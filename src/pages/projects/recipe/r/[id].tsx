// import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "~/utils/trpc";
import { useRouter } from "next/router";
export default function Page() {
  const router = useRouter();
  const id = Number(router.query.id);
  const { data, isLoading }= trpc.recipe.getById.useQuery({id});
  console.log(id, data);
  if (!data || isLoading) {
    return <a>Loading...</a>
  }
  return (
  <div className="justify-center items-center text-center">
    <p>{data.name}</p>
    <p>{data.description}</p>
  </div>
  )
}