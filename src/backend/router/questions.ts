// import * as trpc from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "./index";
import { db} from '../../db/client'
import { sql } from 'drizzle-orm'
import {vote} from '../../db/schema'
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
  GetAllMY: publicProcedure.input(z.object({ email: z.string()})).query(async(opts) => {
      const { input } = opts;
      return await db.query.pollQuestion.findMany({
          with: {
          ownerEmail: input.email,
        
        }
       }
      )
    }),
    GetById: publicProcedure.input(z.object({ id: z.string(), token: z.string(), email: z.string()})).query( async(opts) => {
      const { input } = opts;
      const question = await db.query.pollQuestion.findFirst({
        with: {
          id: input.id,
        }
      })
      const myVote = await db.query.vote.findFirst({
        with: {
          questionId: input.id,
          voterToken: input.token,
        },
      })
      const rest = {
        question,
        vote: myVote,
        isOwner: question?.ownerEmail === input.email,
      };
``
      if (rest.vote || rest.isOwner) {

        const votes = await db.select().from(vote).groupBy(sql`${vote.choice}`).having(sql`count(${vote.choice})`)
        console.log(votes)
        return { ...rest, votes };
      }

      return { ...rest, votes: undefined };
    })
})