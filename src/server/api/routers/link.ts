import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
} from "../trpc";
import { link, linkProfile } from "~/server/db/schema";
import { eq, desc, asc, and } from "drizzle-orm";

const httpUrlSchema = z
  .string()
  .url()
  .max(1000)
  .refine(
    (value) => {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    },
    { message: "URL must start with http:// or https://" },
  );

export const linkRouter = router({
  getProfile: publicProcedure
    .input(
      z.object({
        slug: z.string().max(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db
        .select()
        .from(linkProfile)
        .where(
          and(eq(linkProfile.slug, input.slug), eq(linkProfile.isPublic, true)),
        )
        .limit(1)
        .execute();

      if (!profile[0]) return null;

      const links = await ctx.db.query.link.findMany({
        where: and(eq(link.profileId, profile[0].id), eq(link.isActive, true)),
        orderBy: [asc(link.order)],
      });

      return { profile: profile[0], links };
    }),

  getMyProfile: protectedProcedure.query(async ({ ctx }) => {
    const profile = await ctx.db
      .select()
      .from(linkProfile)
      .where(eq(linkProfile.userId, ctx.userId))
      .limit(1)
      .execute();

    if (!profile[0]) return null;

    const links = await ctx.db.query.link.findMany({
      where: eq(link.profileId, profile[0].id),
      orderBy: [asc(link.order)],
    });

    return { profile: profile[0], links };
  }),

  getLinks: publicProcedure
    .input(
      z.object({
        username: z.string().max(50),
      }),
    )
    .query(async ({ ctx, input }) => {
      const profile = await ctx.db
        .select()
        .from(linkProfile)
        .where(
          and(
            eq(linkProfile.username, input.username),
            eq(linkProfile.isPublic, true),
          ),
        )
        .limit(1)
        .execute();

      if (!profile[0]) {
        return [];
      }

      return ctx.db.query.link.findMany({
        where: and(eq(link.profileId, profile[0].id), eq(link.isActive, true)),
        orderBy: [desc(link.order)],
      });
    }),

  createProfile: protectedProcedure
    .input(
      z.object({
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
        slug: z
          .string()
          .max(50)
          .regex(/^[a-zA-Z0-9_-]+$/)
          .optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profileData = {
        userId: ctx.userId,
        username: input.username,
        displayName: input.displayName,
        bio: input.bio,
        avatarUrl: input.avatarUrl || undefined,
        backgroundColor: input.backgroundColor ?? "#ffffff",
        textColor: input.textColor ?? "#000000",
        buttonStyle: input.buttonStyle ?? "rounded",
        isPublic: input.isPublic ?? true,
        slug: input.slug ?? input.username,
      };

      const createdProfile = await ctx.db
        .insert(linkProfile)
        .values(profileData)
        .returning();

      return createdProfile[0] ?? null;
    }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z
          .string()
          .min(1)
          .max(50)
          .regex(/^[a-zA-Z0-9_-]+$/)
          .optional(),
        displayName: z.string().max(100).optional(),
        bio: z.string().max(500).optional(),
        slug: z
          .string()
          .max(50)
          .regex(/^[a-zA-Z0-9_-]+$/)
          .optional(),
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
      const filtered = Object.fromEntries(
        Object.entries(input).filter(([_, v]) => v !== undefined),
      );
      if (Object.keys(filtered).length === 0) return null;

      const updated = await ctx.db
        .update(linkProfile)
        .set(filtered)
        .where(eq(linkProfile.userId, ctx.userId))
        .returning();

      return updated[0] ?? null;
    }),

  createLink: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1).max(100),
        url: httpUrlSchema,
        icon: z.string().max(50).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db
        .select()
        .from(linkProfile)
        .where(eq(linkProfile.userId, ctx.userId))
        .limit(1)
        .execute();

      if (!profile[0]) throw new Error("Profile not found");

      const existing = await ctx.db.query.link.findMany({
        where: eq(link.profileId, profile[0].id),
        orderBy: [desc(link.order)],
        limit: 1,
      });

      const maxOrder = existing[0]?.order ?? -1;

      const created = await ctx.db
        .insert(link)
        .values({
          profileId: profile[0].id,
          title: input.title,
          url: input.url,
          icon: input.icon,
          order: maxOrder + 1,
        })
        .returning();

      return created[0] ?? null;
    }),

  updateLink: protectedProcedure
    .input(
      z.object({
        linkId: z.number(),
        title: z.string().min(1).max(100).optional(),
        url: httpUrlSchema.optional(),
        isActive: z.boolean().optional(),
        icon: z.string().max(50).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { linkId, ...updates } = input;

      const profile = await ctx.db
        .select()
        .from(linkProfile)
        .where(eq(linkProfile.userId, ctx.userId))
        .limit(1)
        .execute();

      if (!profile[0]) throw new Error("Profile not found");

      const filtered = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined),
      );
      if (Object.keys(filtered).length === 0) return null;

      const updated = await ctx.db
        .update(link)
        .set(filtered)
        .where(and(eq(link.id, linkId), eq(link.profileId, profile[0].id)))
        .returning();

      return updated[0] ?? null;
    }),

  deleteLink: protectedProcedure
    .input(
      z.object({
        linkId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const profile = await ctx.db
        .select()
        .from(linkProfile)
        .where(eq(linkProfile.userId, ctx.userId))
        .limit(1)
        .execute();

      if (!profile[0]) throw new Error("Profile not found");

      await ctx.db
        .delete(link)
        .where(
          and(eq(link.id, input.linkId), eq(link.profileId, profile[0].id)),
        )
        .execute();

      return { success: true };
    }),
});
