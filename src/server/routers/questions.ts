// import * as trpc from "@trpc/server";
import { z } from "zod";
import { procedure, router } from "../trpc";
import { db } from "../../db/client";
import { vote } from "../../db/schema";

import { eq } from "drizzle-orm";
// export const questionRouter = trpc
//   .router()
//   .query("get-all-my", {
//     input: z.object({ email: z.string() }),
//     async resolve({ input }) {
//       return await prisma.pollQuestion.findMany({
//         where: {
//           ownerEmail: { equals: input.email },
//         },
//       })
//     },
//   })
//   .mutation("vote-on-question", {
//     input: z.object({
//       questionId: z.string(),
//       option: z.number().min(0).max(10),
//       token: z.string(),
//     }),
//     async resolve({ input }) {
//       return await prisma.vote.create({
//         data: {
//           questionId: input.questionId,
//           choice: input.option,
//           voterToken: input.token,
//         },
//       });
//     },
//   })
//   .mutation("create", {
//     input: z.object({
//       question: z.string(),
//       email: z.string(),
//       options: z
//         .array(z.object({ text: z.string().min(1).max(200) }))
//         .min(2)
//         .max(200),
//     }),
//     async resolve({ input }) {
//       return await prisma.pollQuestion.create({
//         data: {
//           question: input.question,
//           ownerEmail: input.email,
//           end: false,
//           options: input.options,
//         },
//       });
//     },
//   })
//   .mutation("delete", {
//     input: z.object({
//       id: z.string(),
//     }),
//     async resolve({ input }) {
//       return await prisma.pollQuestion.delete({
//         where: {
//           id: input.id,
//         },
//       });
//     },
//   });
export const questionRouter = router({
  GetAllMY: procedure
    .input(z.object({ email: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await db.query.pollQuestion.findMany({
        with: {
          ownerEmail: input.email,
        },
      });
    }),
  GetById: procedure
    .input(z.object({ id: z.string(), token: z.string(), email: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      const question = await db.query.pollQuestion.findFirst({
        with: {
          id: input.id,
        },
      });
      const myVote = await db.query.vote.findFirst({
        with: {
          questionId: input.id,
          voterToken: input.token,
        },
      });
      const rest = {
        question,
        vote: myVote,
        isOwner: question?.ownerEmail === input.email,
      };
      ``;
      if (rest.vote || rest.isOwner) {
        // old code:
        // i need to rewrite it
        // const votes = await prisma.vote.groupBy({
        //   where: { questionId: input.id },
        //   by: ["choice"], // choice: number
        //   _count: true,
        // });
        // const votes =
        // console.log(votes)
        const votes = db
          .select()
          .from(vote)
          .where(eq(vote.questionId, input.id))
          .groupBy(vote.choice);

        return { ...rest, votes };
      }

      return { ...rest, votes: undefined };
    }),
});