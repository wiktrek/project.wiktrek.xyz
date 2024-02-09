import { z } from "zod";
import { procedure, router } from "../trpc";
import { db, recipe, like} from "~/db/client";
/* 
  recipe router
*/
import { eq, and, not} from "drizzle-orm";
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
    like: procedure.input(z.object({ id: z.number(), email: z.string(), up: z.boolean() })).mutation(async ({input}) => {
      const { up, email, id} = input;
      const amount: number = (up ? 1 : -1);
      console.log(amount, up);
      const recipeData = await db.query.recipe.findFirst({
        where: eq(recipe.id, id)
      });
      if (!recipeData) {
        return false
      }
      const likeData = await db.query.like.findFirst({
        where: and(eq(like.owner, email))
      })
      if (likeData?.up == (up ? true : false)) return false
       
      if (!likeData) {
      const createdLike = await db.insert(like).values({
owner: email,
recipeId: id,
up: (up ? true : false)
      })
      const editedRecipe = await db.update(recipe).set({
        rating: recipeData.rating + amount
      }).where(eq(recipe.id, id))
      console.log(editedRecipe, createdLike);
      return true
      
      } else {
         const createdLike = await db.update(like).set({
owner: email,
recipeId: id,
up: (up ? true : false)
      }).where(and(eq(like.owner, email), eq(like.up, up ? true : false)))



    await db.update(recipe).set({
        rating: recipeData.rating + amount
      }).where(eq(recipe.id, id))
      console.log(createdLike);
      return true
      }

    })
});


