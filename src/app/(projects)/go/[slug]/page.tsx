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
  let url: URL;
  try {
    url = new URL(data.s.url);
  } catch {
    return <p>Invalid redirect URL</p>;
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return <p>Invalid redirect URL</p>;
  }
  redirect(url.toString());
  return <p>redirecting...</p>;
}
