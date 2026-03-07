import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { link, linkProfile } from "~/server/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export const linkRouter = router({
  getLinks: procedure.input(z.object({ username: z.string().max(50) })).query(async ({ ctx, input }) => {
    const profile = await ctx.db.select().from(linkProfile).where(eq(linkProfile.username, input.username)).limit(1).execute();
    return (await ctx.db.query.link.findMany({
      where: eq(link.profileId, profile[0]?.id!),
      orderBy: [desc(link.order)]
    }));
  createProfile: procedure.input(z.object({})).mutation(async ({ctx,input}) => {
    
  })
  }),
});

