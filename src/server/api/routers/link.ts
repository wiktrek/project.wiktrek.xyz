import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { link, linkProfile } from "~/server/db/schema";
import { eq, desc } from "drizzle-orm";

export const linkRouter = router({
  getLinks: procedure
    .input(
      z.object({
        username: z.string().max(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db
        .select()
        .from(linkProfile)
        .where(eq(linkProfile.username, input.username))
        .limit(1)
        .execute();

      if (!profile[0]) {
        return [];
      }

      return ctx.db.query.link.findMany({
        where: eq(link.profileId, profile[0].id),
        orderBy: [desc(link.order)],
      });
    }),

  createProfile: procedure
    .input(
      z.object({
        userId: z.string().min(1).max(255),
        username: z
          .string()
          .min(1)
          .max(50)
          .regex(/^[a-zA-Z0-9_-]+$/),
        displayName: z.string().max(100).optional(),
        bio: z.string().max(500).optional(),
        avatarUrl: z.string().url().max(500).optional().or(z.literal("")),
        backgroundColor: z
          .string()
          .max(20)
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        textColor: z
          .string()
          .max(20)
          .regex(/^#[0-9A-Fa-f]{6}$/)
          .optional(),
        buttonStyle: z.enum(["rounded", "square", "pill"]).optional(),
        isPublic: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profileData = {
        userId: input.userId,
        username: input.username,
        displayName: input.displayName,
        bio: input.bio,
        avatarUrl: input.avatarUrl || undefined,
        backgroundColor: input.backgroundColor ?? "#ffffff",
        textColor: input.textColor ?? "#000000",
        buttonStyle: input.buttonStyle ?? "rounded",
        isPublic: input.isPublic ?? true,
      };

      const createdProfile = await ctx.db
        .insert(linkProfile)
        .values(profileData)
        .returning();

      return createdProfile[0] ?? null;
    }),
});

