import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "~/db/client";
import { shortLink } from "~/db/schema";
import { eq } from "drizzle-orm";

export const shortRouter = router({
  getSlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const s = await db.query.shortLink.findFirst({
        where: eq(shortLink.slug, input.slug),
      });
      return { s };
    }),
  getAllLinks: procedure
    .input(z.object({ email: z.string() }))
    .query(async ({ input }) => {
      const links = await db.query.shortLink.findMany({
        where: eq(shortLink.owner, input.email),
      });
      return links;
    }),
  removeSlug: procedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ input }) => {
      const { slug } = input;
      const deletedSlug = db.delete(shortLink).where(eq(shortLink.slug, slug));
      return deletedSlug;
    }),
    createSlug: procedure.input(z.object({ slug: z.string(), url: z.string(), email: z.string() })).mutation(async ({ input }) => {
      const { slug, url, email } = input;
      const createdSlug = db.insert(shortLink).values({ owner: email, slug: slug, url: url });
      return createdSlug;
    })

});
