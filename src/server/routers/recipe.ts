import { z } from "zod";
import { procedure, router } from "../trpc";
import { db, recipe  } from "~/db/client";

import { eq,} from "drizzle-orm";
export const recipeRouter = router({
  getAllMY: procedure
    .input(z.object({ email: z.string() }))
    .query(async (opts) => {
      const { input } = opts;
      return await db.query.recipe.findMany({
        where: eq(recipe.owner, input.email)   
      });
    }),
  getById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return await db.query.recipe.findFirst({
        where: eq(recipe.id, input.id),
      });
    }),
});


