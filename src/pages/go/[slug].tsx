// import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
export default function Page() {
  const router = useRouter();
  if (router.query.slug == null ) return;
  const slug = router.query.slug as string;
  
  const { data } = trpc.short.getSlug.useQuery({
    slug: slug,
  });
  if (!data) return <p>Slug not found</p>;
  router.push(data?.s?.url as string);
  
  // console.log(slug, data);
  return <p>redirecting...</p>;
}