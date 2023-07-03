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

// export default async function slug(req: NextApiRequest, res: NextApiResponse) {
//   const slug = req.query.slug;
//   if (!slug || typeof slug !== "string") {
//     res.statusCode = 404;

//     res.send(JSON.stringify({ message: "pls use with a slug" }));

//     return;
//   }

//   // const data = await prisma.shortLink.findFirst({
//   //   where: {
//   //     slug: {
//   //       equals: slug,
//   //     },
//   //   },
//   // });

//   const data = trpc.short.getSlug.useQuery({ slug: "wiktrek" });
//   // useQuery({ slug: "wiktrek" });
//   if (!data) {
//     res.statusCode = 404;

//     res.send(JSON.stringify({ message: "slug not found" }));

//     return;
//   }

//   res.setHeader("Content-Type", "application/json");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Cache-Control", "s-maxage=1000000000, stale-while-revalidate");

//   return res.redirect(data.data?.s.url as string);
// }
