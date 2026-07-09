import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import { vote, pollQuestion } from "~/server/db/schema";

import { eq, sql, and, asc } from "drizzle-orm";
export const questionRouter = router({
  getAllMY: protectedProcedure.query(async ({ ctx }) => {
    const email = await getRequiredUserEmail(ctx);
    return await ctx.db.query.pollQuestion.findMany({
      where: eq(pollQuestion.ownerEmail, email),
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const { id } = input;
      const question = await ctx.db.query.pollQuestion.findFirst({
        where: eq(pollQuestion.id, id),
      });
      const voterToken = ctx.auth.userId ? `user:${ctx.auth.userId}` : null;
      const myVote = voterToken
        ? await ctx.db.query.vote.findFirst({
            where: and(
              eq(vote.questionId, id),
              eq(vote.voterToken, voterToken),
            ),
          })
        : undefined;
      const email = await ctx.getUserEmail();
      const isOwner = email !== null && question?.ownerEmail === email;

      const rest = {
        question,
        vote: myVote,
        isOwner,
      };
      if (rest.vote || rest.isOwner) {
        const votes = await ctx.db
          .select({
            choice: vote.choice,
            count: sql<number>`count(${vote.choice})`,
          })
          .from(vote)
          .where(eq(vote.questionId, id))
          .groupBy(vote.choice)
          .orderBy(asc(vote.choice));

        return { ...rest, votes };
      } else {
        return { ...rest, votes: undefined };
      }
    }),
  voteOn: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        option: z.number().int().min(0),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { questionId, option } = input;
      const question = await ctx.db.query.pollQuestion.findFirst({
        where: eq(pollQuestion.id, questionId),
      });
      if (!question) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Poll not found" });
      }

      const options = question.options as { text: string }[];
      if (!options[option]) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid vote option",
        });
      }

      const voterToken = `user:${ctx.userId}`;
      const existingVote = await ctx.db.query.vote.findFirst({
        where: and(
          eq(vote.questionId, questionId),
          eq(vote.voterToken, voterToken),
        ),
      });
      if (existingVote) return false;

      const createdVote = await ctx.db.insert(vote).values({
        questionId: questionId,
        choice: option,
        voterToken,
      });
      return createdVote;
    }),
  createQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        options: z
          .array(z.object({ text: z.string().min(1).max(200) }))
          .min(2)
          .max(200),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { question, options } = input;
      const email = await getRequiredUserEmail(ctx);
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
  deleteQuestion: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id } = input;
      const email = await getRequiredUserEmail(ctx);
      const deletedQuestion = await ctx.db
        .delete(pollQuestion)
        .where(
          and(eq(pollQuestion.id, id), eq(pollQuestion.ownerEmail, email)),
        );
      return deletedQuestion;
    }),
});
