import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "../../db/client";
export const shortRouter = router({
  getSlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const { slug } = input;
      const s = await db.query.shortLink.findFirst({
        with: {
          slug: slug,
        },
      });
      // const s = {
      //   url: "ez",
      // };
      return { s };
    }),
});
