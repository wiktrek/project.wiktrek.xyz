import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import { message } from "~/server/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export const messageRouter = router({
  getMessages: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.message.findMany({
      orderBy: [desc(message.createdAt)],
    });
  }),
  createMessage: protectedProcedure
    .input(z.object({ text: z.string().max(64) }))
    .mutation(async ({ ctx, input }) => {
      const email = await getRequiredUserEmail(ctx);
      const author = (email.split("@")[0] || "user").slice(0, 16);
      const { text } = input;
      await ctx.db.insert(message).values({
        author: author,
        text: text,
      });
      const count = await ctx.db
        .select({
          count: sql`count(*)`.as<number>("count"),
        })
        .from(message);
      if (count[0]!.count >= 101) {
        const oldestUser = await ctx.db
          .select()
          .from(message)
          .orderBy(message.createdAt)
          .limit(1)
          .execute();
        const oldestUserId = oldestUser[0]!.id;
        await ctx.db
          .delete(message)
          .where(eq(message.id, oldestUserId))
          .execute();
      }
    }),
});
