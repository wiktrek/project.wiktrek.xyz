import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "~/db/client";
import { shortLink } from "~/db/schema";
import { eq } from "drizzle-orm";

export const shortRouter = router({
  getSlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { slug } = input;
      const s = await db.query.shortLink.findFirst({
        where: eq(shortLink.slug, slug),
      });
      // const s = {
      //   url: "ez",
      // };
      return { s };
    }),
});
