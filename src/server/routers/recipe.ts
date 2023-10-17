import { z } from "zod";
import { procedure, router } from "../trpc";
import { db, recipe  } from "~/db/client";

import { eq,} from "drizzle-orm";
const recipeSchema = z.object({
      name: z.string(),
      description: z.string(),
      email: z.string(),
      recipe: z.number(),
      directions: z.array(z.object({ name: z.string().min(1).max(200), number: z.number(), step: z.string().min(1).max(200)}))
        .min(1)
        .max(200),
      ingredients: z
        .array(z.object({ ingredient: z.string().min(1).max(200), amount: z.number() }))
        .min(2)
        .max(200)}
        )
export type recipeType = z.infer<typeof recipeSchema>
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
    createRecipe: procedure.input(recipeSchema)
    .mutation(({ input }) => {
      const createdRecipe = db.insert(recipe).values({
        name: input.name,
        rating: 0,
        description: input.description,
        ingredients: input.ingredients,
        directions: input.directions,
        owner: input.email,
      })
      return createdRecipe
    }),
    changeRating: procedure.input(z.object({
      rating: z.number(),
      id: z.number(),
    })).mutation(({ input }) => {
      const editedRecipe = db.update(recipe).set({
        rating: input.rating,
      }).where(eq(recipe.id, input.id))
      return editedRecipe
    })
});


