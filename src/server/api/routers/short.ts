import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import { shortLink } from "~/server/db/schema";
import { and, eq } from "drizzle-orm";

const slugSchema = z
  .string()
  .min(1)
  .max(191)
  .regex(/^[a-zA-Z0-9_-]+$/);

const httpUrlSchema = z
  .string()
  .url()
  .max(255)
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "URL must start with http:// or https://");

export const shortRouter = router({
  getSlug: publicProcedure
    .input(z.object({ slug: slugSchema }))
    .query(async ({ ctx, input }) => {
      const s = await ctx.db.query.shortLink.findFirst({
        where: eq(shortLink.slug, input.slug),
      });
      return { s };
    }),
  getAllLinks: protectedProcedure.query(async ({ ctx }) => {
    const email = await getRequiredUserEmail(ctx);
    const links = await ctx.db.query.shortLink.findMany({
      where: eq(shortLink.owner, email),
    });
    return links;
  }),
  removeSlug: protectedProcedure
    .input(z.object({ slug: slugSchema }))
    .mutation(async ({ ctx, input }) => {
      const email = await getRequiredUserEmail(ctx);
      const { slug } = input;
      const deletedSlug = await ctx.db
        .delete(shortLink)
        .where(and(eq(shortLink.slug, slug), eq(shortLink.owner, email)));
      return deletedSlug;
    }),
  createSlug: protectedProcedure
    .input(z.object({ slug: slugSchema, url: httpUrlSchema }))
    .mutation(async ({ ctx, input }) => {
      const email = await getRequiredUserEmail(ctx);
      const { slug, url } = input;
      const createdSlug = await ctx.db
        .insert(shortLink)
        .values({ owner: email, slug: slug, url: url });
      return createdSlug;
    }),
});
