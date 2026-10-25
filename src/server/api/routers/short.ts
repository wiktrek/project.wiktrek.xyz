import { z } from "zod";
import { after } from "next/server";
import { TRPCError } from "@trpc/server";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import { shortLink } from "~/server/db/schema";
import { and, eq, sql } from "drizzle-orm";

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

function isSafeDestination(value: string) {
  const url = new URL(value);
  const hostname = url.hostname.toLowerCase();
  return (
    !url.username &&
    !url.password &&
    hostname !== "localhost" &&
    hostname !== "127.0.0.1" &&
    hostname !== "0.0.0.0" &&
    !hostname.endsWith(".local") &&
    !/^(10\.|192\.168\.|172\.(1[6-9]|2\d|3[0-1])\.)/.test(hostname)
  );
}

export const shortRouter = router({
  getSlug: publicProcedure
    .input(z.object({ slug: slugSchema }))
    .query(async ({ ctx, input }) => {
      const s = await ctx.db.query.shortLink.findFirst({
        where: eq(shortLink.slug, input.slug),
      });
      if (s) {
        // Record the click after the response is sent so the redirect
        // doesn't wait on the write.
        after(() =>
          ctx.db
            .update(shortLink)
            .set({
              clickCount: sql`${shortLink.clickCount} + 1`,
              lastClickedAt: new Date(),
            })
            .where(eq(shortLink.id, s.id)),
        );
      }
      return { s };
    }),
  getAllLinks: protectedProcedure.query(async ({ ctx }) => {
    const email = await getRequiredUserEmail(ctx);
    const links = await ctx.db.query.shortLink.findMany({
      where: eq(shortLink.owner, email),
      orderBy: (link, { desc }) => [desc(link.createdAt)],
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
      if (!isSafeDestination(url))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That destination is not allowed",
        });
      const recentLinks = await ctx.db.query.shortLink.findMany({
        where: eq(shortLink.owner, email),
        limit: 20,
      });
      if (recentLinks.length >= 20)
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: "Link creation limit reached",
        });
      const createdSlug = await ctx.db
        .insert(shortLink)
        .values({ owner: email, slug: slug, url: url });
      return createdSlug;
    }),
  updateSlug: protectedProcedure
    .input(z.object({ slug: slugSchema, url: httpUrlSchema }))
    .mutation(async ({ ctx, input }) => {
      const email = await getRequiredUserEmail(ctx);
      if (!isSafeDestination(input.url))
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "That destination is not allowed",
        });
      return ctx.db
        .update(shortLink)
        .set({ url: input.url })
        .where(and(eq(shortLink.slug, input.slug), eq(shortLink.owner, email)))
        .returning();
    }),
});
