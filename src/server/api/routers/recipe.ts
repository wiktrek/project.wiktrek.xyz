import { z } from "zod";
import {
  publicProcedure as procedure,
  createTRPCRouter as router,
} from "../trpc";
import { recipe, like } from "~/server/db/schema";
/* 
  recipe router
*/
import { eq, and } from "drizzle-orm";
const recipeSchema = z.object({
  name: z.string(),
  description: z.string(),
  email: z.string(),
  recipe: z.number(),
  instructions: z
    .array(
      z.object({
        name: z.string().min(1).max(200),
        step: z.string().min(1).max(200),
      }),
    )
    .min(1)
    .max(200),
  ingredients: z
    .array(
      z.object({ ingredient: z.string().min(1).max(200), amount: z.number() }),
    )
    .min(2)
    .max(200),
});
export type recipeType = z.infer<typeof recipeSchema>;
export const recipeRouter = router({
  getAllMY: procedure
    .input(z.object({ email: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipe.findMany({
        where: eq(recipe.owner, input.email),
      });
    }),
  getById: procedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipe.findFirst({
        where: eq(recipe.id, input.id),
      });
    }),
  createRecipe: procedure.input(recipeSchema).mutation(({ ctx, input }) => {
    const createdRecipe = ctx.db.insert(recipe).values({
      name: input.name,
      rating: 0,
      description: input.description,
      ingredients: input.ingredients,
      instructions: input.instructions,
      owner: input.email,
    });
    return createdRecipe;
  }),
  like: procedure
    .input(z.object({ id: z.number(), email: z.string(), up: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { up, email, id } = input;
      const amount: number = up ? 1 : -1;
      console.log(amount, up);
      const recipeData = await ctx.db.query.recipe.findFirst({
        where: eq(recipe.id, id),
      });
      if (!recipeData) {
        return false;
      }
      const likeData = await ctx.db.query.like.findFirst({
        where: and(eq(like.owner, email)),
      });
      if (likeData?.up == (up ? true : false)) return false;

      if (!likeData) {
        const createdLike = await ctx.db.insert(like).values({
          owner: email,
          recipeId: id,
          up: up ? true : false,
        });
        const editedRecipe = await ctx.db
          .update(recipe)
          .set({
            rating: recipeData.rating + amount,
          })
          .where(eq(recipe.id, id));
        console.log(editedRecipe, createdLike);
        return true;
      } else {
        const createdLike = await ctx.db
          .update(like)
          .set({
            owner: email,
            recipeId: id,
            up: up ? true : false,
          })
          .where(and(eq(like.owner, email), eq(like.up, up ? true : false)));

        await ctx.db
          .update(recipe)
          .set({
            rating: recipeData.rating + amount,
          })
          .where(eq(recipe.id, id));
        console.log(createdLike);
        return true;
      }
    }),
});
