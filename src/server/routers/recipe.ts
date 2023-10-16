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
    createRecipe: procedure.input(z.object({
      name: z.string(),
      description: z.string(),
      ingredients: z.string(),
      email: z.string(),
    })).mutation(({ input }) => {
      const createdRecipe = db.insert(recipe).values({
        name: input.name,
        rating: 0,
        description: input.description,
        ingredients: input.ingredients,
        owner: input.email,
      })
      return createdRecipe
    }),
    ChangeRating: procedure.input(z.object({
      rating: z.number(),
      id: z.number(),
    })).mutation(({ input }) => {
      const editedRecipe = db.update(recipe).set({
        id: input.rating,
      }).where(eq(recipe.id, input.id))
      return editedRecipe
    })
});


