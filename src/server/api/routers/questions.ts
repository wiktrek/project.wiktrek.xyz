import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import { vote, voteAnswer, pollQuestion, pollOption } from "~/server/db/schema";

import { eq, sql, and, asc } from "drizzle-orm";

const orderedOptions = {
  columns: { id: true, text: true },
  orderBy: asc(pollOption.position),
} as const;
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
      const voterToken = ctx.auth.userId ? `user:${ctx.auth.userId}` : null;
      const [question, myVote, email] = await Promise.all([
        ctx.db.query.pollQuestion.findFirst({
          where: eq(pollQuestion.id, id),
          with: { options: orderedOptions },
        }),
        voterToken
          ? ctx.db.query.vote.findFirst({
              where: and(
                eq(vote.questionId, id),
                eq(vote.voterToken, voterToken),
              ),
            })
          : Promise.resolve(undefined),
        ctx.getUserEmail(),
      ]);
      const isOwner = email !== null && question?.ownerEmail === email;

      const rest = {
        question: question && {
          ...question,
          options: question.options.map(({ text }) => ({ text })),
        },
        vote: myVote,
        isOwner,
      };
      if (rest.vote || rest.isOwner) {
        const position = new Map(
          question?.options.map((option, index) => [option.id, index]),
        );
        const votes = await ctx.db.query.vote.findMany({
          where: eq(vote.questionId, id),
          columns: { choice: true, createdAt: true },
          with: {
            answers: {
              columns: { optionId: true },
              orderBy: [asc(voteAnswer.rank)],
            },
          },
        });
        return {
          ...rest,
          votes: votes.map((item) => ({
            ...item,
            answers: item.answers.map(
              (answer) => position.get(answer.optionId) ?? -1,
            ),
          })),
        };
      } else {
        return { ...rest, votes: undefined };
      }
    }),
  recordView: publicProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(pollQuestion)
        .set({ viewCount: sql`${pollQuestion.viewCount} + 1` })
        .where(eq(pollQuestion.id, input.id));
      return { success: true };
    }),
  voteOn: protectedProcedure
    .input(
      z.object({
        questionId: z.number(),
        option: z.number().int().min(0),
        answers: z.array(z.number().int().min(0)).min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { questionId, option } = input;
      const question = await ctx.db.query.pollQuestion.findFirst({
        where: eq(pollQuestion.id, questionId),
        with: { options: orderedOptions },
      });
      if (!question) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Poll not found" });
      }
      if (question.end || (question.endsAt && question.endsAt <= new Date())) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "This poll is closed",
        });
      }

      const options = question.options;
      const answers = input.answers ?? [option];
      if (
        (question.questionType === "single" ||
          question.questionType === "rating") &&
        answers.length !== 1
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Choose exactly one answer",
        });
      }
      if (
        question.questionType === "ranking" &&
        new Set(answers).size !== answers.length
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ranking answers must be unique",
        });
      }
      if (!options[option] || answers.some((answer) => !options[answer])) {
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

      await ctx.db.transaction(async (tx) => {
        const [createdVote] = await tx
          .insert(vote)
          .values({ questionId: questionId, choice: option, voterToken })
          .returning({ id: vote.id });
        if (!createdVote) throw new Error("Failed to record vote");
        await tx.insert(voteAnswer).values(
          answers.map((answer, rank) => ({
            voteId: createdVote.id,
            optionId: options[answer]!.id,
            rank,
          })),
        );
      });
      return true;
    }),
  createQuestion: protectedProcedure
    .input(
      z.object({
        question: z.string(),
        options: z
          .array(z.object({ text: z.string().min(1).max(200) }))
          .min(2)
          .max(200),
        questionType: z
          .enum(["single", "multiple", "ranking", "rating"])
          .default("single"),
        endsAt: z.coerce.date().nullable().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { question, options, questionType, endsAt } = input;
      const email = await getRequiredUserEmail(ctx);
      return ctx.db.transaction(async (tx) => {
        const createdQuestion = await tx
          .insert(pollQuestion)
          .values({
            question: question,
            ownerEmail: email,
            end: false,
            questionType,
            endsAt,
          })
          .returning({ insertedId: pollQuestion.id });
        const questionId = createdQuestion[0]!.insertedId;
        await tx.insert(pollOption).values(
          options.map(({ text }, position) => ({
            questionId,
            position,
            text,
          })),
        );
        return createdQuestion;
      });
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
