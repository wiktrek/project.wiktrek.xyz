import { z } from "zod";
import { procedure, router } from "../trpc";
import { db,vote, pollQuestion  } from "../../db/client";

import { eq, sql } from "drizzle-orm";
export const questionRouter = router({
  getAllMY: procedure
    .input(z.object({ email: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await db.query.pollQuestion.findMany({
        where: eq(pollQuestion.ownerEmail, input.email)
        
      });
    }),
  getById: procedure
    .input(z.object({ id: z.number(), token: z.string(), email: z.string() }))
    .query(async ({ input}) => {
      const { id, token, email } = input;
      const question = await db.query.pollQuestion.findFirst({
        where: eq(pollQuestion.id, id)
      });
      const myVote = await db.select().from(vote).where(eq(vote.questionId, id)).where(eq(vote.voterToken, token)).limit(1)
      const rest = {
        question,
        vote: myVote[0],
        isOwner: question?.ownerEmail === email,
      };
      if (rest.vote || rest.isOwner) {
        const votes = await db
          .select({ count: sql<number>`count(${vote.choice})`})
          .from(vote)
          .where(eq(vote.questionId, id))
          .groupBy(vote.choice)
          
        return { ...rest, votes };
      }

      return { ...rest, votes: undefined };
    }),
    voteOn: procedure.input(z.object({
      questionId: z.number(),
      option: z.number().min(0).max(10),
      token: z.string(),
    })).mutation(({ input }) => {
      const { questionId, option, token } = input
      const createdVote = db.insert(vote).values({
        questionId: questionId, 
        choice: option, 
        voterToken: token 
      })
      return createdVote
    }),
    createQuestion: procedure.input(z.object({ 
      question: z.string(),
      email: z.string(),
      options: z
        .array(z.object({ text: z.string().min(1).max(200) }))
        .min(2)
        .max(200),
    })).mutation(({input}) => {
      const { question, email, options} = input
      const createdQuestion = db.insert(pollQuestion).values({
          question: question,
          ownerEmail: email,
          end: 0,
          options: options,
      })
      return createdQuestion
    }),
    deleteQuestion: procedure.input(z.object({
      id: z.number()
    })).mutation(({ input }) => {
      const { id } = input
      const deletedQuestion = db.delete(pollQuestion).where(eq(pollQuestion.id, id));
      return deletedQuestion
    })
});
