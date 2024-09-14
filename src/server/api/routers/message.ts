import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { message } from "~/server/db/schema";
import { eq, sql } from "drizzle-orm";

export const messageRouter = router({
  getMessages: procedure.query(async ({ ctx, input }) => {
    const s = await ctx.db.query.message.findMany();
    return { s };
  }),
  createMessage: procedure
    .input(z.object({ text: z.string().max(128), author: z.string().max(16) }))
    .mutation(async ({ ctx, input }) => {
      const { author, text } = input;
      const createdMessage = await ctx.db.insert(message).values({
        author: author,
        text: text,
      });
      //   const oldestUser = await ctx.db
      //     .select(message)
      //     .orderBy(message.createdAt)
      //     .limit(1);
      const count = await ctx.db
        .select({
          count: sql`count(*)`.as<number>(),
        })
        .from(message);
      console.log(count);
      //   await ctx.db.delete(message).where(eq(message.id, oldestUser[0].id));
    }),
});
