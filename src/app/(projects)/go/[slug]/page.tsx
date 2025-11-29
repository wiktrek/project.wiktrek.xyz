import { api as trpc } from "~/trpc/server";
import { redirect } from "next/navigation";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { slug } = await params;
  const data = await trpc.short.getSlug({
    slug,
  });

  if (!data?.s?.url || data.s.url == undefined) return <p>Slug not found</p>;
  redirect(data?.s?.url);
  return <p>redirecting...</p>;
}
