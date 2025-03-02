import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { shortLink } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

export const shortRouter = router({
  getSlug: procedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ ctx, input }) => {
      const s = await ctx.db.query.shortLink.findFirst({
        where: eq(shortLink.slug, input.slug),
      });
      return { s };
    }),
  getAllLinks: procedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      const links = await ctx.db.query.shortLink.findMany({
        where: eq(shortLink.owner, input.email),
      });
      return links;
    }),
  removeSlug: procedure
    .input(z.object({ slug: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { slug } = input;
      const deletedSlug = ctx.db
        .delete(shortLink)
        .where(and(eq(shortLink.slug, slug), eq(shortLink.owner, input.email)));
      return deletedSlug;
    }),
  createSlug: procedure
    .input(z.object({ slug: z.string(), url: z.string(), email: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { slug, url, email } = input;
      const createdSlug = ctx.db
        .insert(shortLink)
        .values({ owner: email, slug: slug, url: url });
      return createdSlug;
    }),
});
