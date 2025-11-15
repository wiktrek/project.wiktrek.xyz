import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { message } from "~/server/db/schema";
import { eq, sql, desc } from "drizzle-orm";

export const messageRouter = router({
  getMessages: procedure.query(async ({ ctx }) => {
    return (await ctx.db.query.message.findMany({
      orderBy: [desc(message.createdAt)]
    }));
  }),
  createMessage: procedure
    .input(z.object({ text: z.string().max(64), author: z.string().max(16) }))
    .mutation(async ({ ctx, input }) => {
      const { author, text } = input;
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
