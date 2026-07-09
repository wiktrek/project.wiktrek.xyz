import { z } from "zod";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import { recipe, like } from "~/server/db/schema";
import { recipeValidator } from "~/shared/recipe-validator";
/* 
  recipe router
*/
import { eq, and, desc } from "drizzle-orm";

export type recipeType = z.infer<typeof recipeValidator>;
export const recipeRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.query.recipe.findMany({
      orderBy: [desc(recipe.rating)],
    });
  }),
  getAllMY: protectedProcedure.query(async ({ ctx }) => {
    const email = await getRequiredUserEmail(ctx);
    return await ctx.db.query.recipe.findMany({
      where: eq(recipe.owner, email),
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return await ctx.db.query.recipe.findFirst({
        where: eq(recipe.id, input.id),
      });
    }),
  createRecipe: protectedProcedure
    .input(recipeValidator)
    .mutation(async ({ ctx, input }) => {
      const email = await getRequiredUserEmail(ctx);
      const [createdRecipe] = await ctx.db
        .insert(recipe)
        .values({
          name: input.name,
          rating: 0,
          description: input.description,
          imageUrl: input.imageUrl || null,
          ingredients: input.ingredients,
          instructions: input.instructions,
          owner: email,
        })
        .returning();
      if (!createdRecipe) {
        throw new Error("Failed to create recipe");
      }
      return createdRecipe;
    }),
  like: protectedProcedure
    .input(z.object({ id: z.number(), up: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const { up, id } = input;
      const email = await getRequiredUserEmail(ctx);
      const amount: number = up ? 1 : -1;
      const recipeData = await ctx.db.query.recipe.findFirst({
        where: eq(recipe.id, id),
      });
      if (!recipeData) {
        return false;
      }
      const likeData = await ctx.db.query.like.findFirst({
        where: and(eq(like.owner, email), eq(like.recipeId, id)),
      });
      if (likeData?.up === up) return false;

      if (!likeData) {
        await ctx.db.insert(like).values({
          owner: email,
          recipeId: id,
          up,
        });
        await ctx.db
          .update(recipe)
          .set({
            rating: recipeData.rating + amount,
          })
          .where(eq(recipe.id, id));
        return true;
      } else {
        await ctx.db
          .update(like)
          .set({
            up,
          })
          .where(eq(like.id, likeData.id));

        await ctx.db
          .update(recipe)
          .set({
            rating: recipeData.rating + amount * 2,
          })
          .where(eq(recipe.id, id));
        return true;
      }
    }),
});
