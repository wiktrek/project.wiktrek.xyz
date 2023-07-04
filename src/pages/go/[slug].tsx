// import { NextApiRequest, NextApiResponse } from "next";
import { trpc } from "../../utils/trpc";
import { useRouter } from "next/router";
export default function Page() {
  const router = useRouter();
  const slug = router.query.slug as string;
  console.log(slug);
  const { data } = trpc.short.getSlug.useQuery({
    slug: slug,
  });
  if (!data) return <p>Slug not found</p>;
  router.push(data?.s?.url as string);
  return <p>redirecting...</p>;
}