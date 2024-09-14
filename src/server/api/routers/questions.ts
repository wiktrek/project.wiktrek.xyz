import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { vote, pollQuestion } from "~/server/db/schema";

import { eq, sql, and } from "drizzle-orm";
export const questionRouter = router({
  getAllMY: procedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.pollQuestion.findMany({
        where: eq(pollQuestion.ownerEmail, input.email),
      });
    }),
  getById: procedure
    .input(z.object({ id: z.number(), token: z.string(), email: z.string() }))
    .query(async ({ ctx, input }) => {
      const { id, token, email } = input;
      const question = await ctx.db.query.pollQuestion.findFirst({
        where: eq(pollQuestion.id, id),
      });
      // it works
      // const myVote = await ctx.db.select().from(vote).where(eq(vote.questionId, id)).where(eq(vote.voterToken, token)).limit(1)
      const myVote = await ctx.db.query.vote.findFirst({
        where: and(eq(vote.questionId, id), eq(vote.voterToken, token)),
      });

      const rest = {
        question,
        vote: myVote,
        isOwner: question?.ownerEmail === email,
      };
      if (rest.vote ?? rest.isOwner) {
        const votes = await ctx.db
          .select({ count: sql<number>`count(${vote.choice})` })
          .from(vote)
          .where(eq(vote.questionId, id))
          .groupBy(vote.choice);

        return { ...rest, votes };
      } else {
        return { ...rest, votes: undefined };
      }
    }),
  voteOn: procedure
    .input(
      z.object({
        questionId: z.number(),
        option: z.number().min(0).max(10),
        token: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { questionId, option, token } = input;
      const createdVote = await ctx.db.insert(vote).values({
        questionId: questionId,
        choice: option,
        voterToken: token,
      });
      return createdVote;
    }),
  createQuestion: procedure
    .input(
      z.object({
        question: z.string(),
        email: z.string(),
        options: z
          .array(z.object({ text: z.string().min(1).max(200) }))
          .min(2)
          .max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { question, email, options } = input;
      const createdQuestion = await ctx.db
        .insert(pollQuestion)
        .values({
          question: question,
          ownerEmail: email,
          end: false,
          options: options,
        })
        .returning({ insertedId: pollQuestion.id });
      return createdQuestion;
    }),
  deleteQuestion: procedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id } = input;
      const deletedQuestion = ctx.db
        .delete(pollQuestion)
        .where(eq(pollQuestion.id, id));
      return deletedQuestion;
    }),
});
