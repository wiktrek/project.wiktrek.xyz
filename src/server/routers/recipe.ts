import { z } from "zod";
import { procedure, router } from "../trpc";
import { db,vote, pollQuestion  } from "../../db/client";

import { eq, sql } from "drizzle-orm";
export const questionRouter = router({
  getAllMY: procedure
    .input(z.object({ email: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
    //   return await db.query.pollQuestion.findMany({
    //     where: eq(pollQuestion.ownerEmail, input.email)
        
    //   });
    }),
});

