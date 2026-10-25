import { z } from "zod";
import { revalidateTag, unstable_cache } from "next/cache";
import {
  publicProcedure,
  protectedProcedure,
  createTRPCRouter as router,
  getRequiredUserEmail,
} from "../trpc";
import {
  recipe,
  recipeIngredient,
  recipeInstruction,
  recipeDietaryTag,
  like,
} from "~/server/db/schema";
import { recipeValidator } from "~/shared/recipe-validator";
/* 
  recipe router
*/
import { eq, and, asc, desc, ilike, inArray, or, sql } from "drizzle-orm";
import { db } from "~/server/db";

const recipeListColumns = {
  id: true,
  rating: true,
  name: true,
  description: true,
  imageUrl: true,
  prepTimeMinutes: true,
  cookTimeMinutes: true,
  difficulty: true,
  category: true,
} as const;

export type recipeType = z.infer<typeof recipeValidator>;

type PublicRecipeFilters = {
  search?: string;
  category?: string;
  difficulty?: string;
  dietaryTag?: string;
  maxMinutes?: number;
};

const getPublicRecipesCached = unstable_cache(
  async (input?: PublicRecipeFilters) => {
    const conditions = [];
    if (input?.search) {
      const pattern = `%${input.search}%`;
      conditions.push(
        or(
          ilike(recipe.name, pattern),
          ilike(recipe.description, pattern),
          inArray(
            recipe.id,
            db
              .select({ id: recipeIngredient.recipeId })
              .from(recipeIngredient)
              .where(ilike(recipeIngredient.ingredient, pattern)),
          ),
        ),
      );
    }
    if (input?.category) conditions.push(eq(recipe.category, input.category));
    if (input?.difficulty)
      conditions.push(eq(recipe.difficulty, input.difficulty));
    if (input?.dietaryTag) {
      conditions.push(
        inArray(
          recipe.id,
          db
            .select({ id: recipeDietaryTag.recipeId })
            .from(recipeDietaryTag)
            .where(eq(recipeDietaryTag.tag, input.dietaryTag)),
        ),
      );
    }
    if (input?.maxMinutes) {
      conditions.push(
        sql`${recipe.prepTimeMinutes} + ${recipe.cookTimeMinutes} <= ${input.maxMinutes}`,
      );
    }
    return db.query.recipe.findMany({
      where: conditions.length ? and(...conditions) : undefined,
      orderBy: [desc(recipe.rating)],
      columns: recipeListColumns,
    });
  },
  ["public-recipes"],
  { revalidate: 60, tags: ["public-recipes"] },
);

const getPublicRecipeCached = unstable_cache(
  async (id: number) => {
    const data = await db.query.recipe.findFirst({
      where: eq(recipe.id, id),
      with: {
        ingredients: {
          columns: { ingredient: true, amount: true, amountType: true },
          orderBy: [asc(recipeIngredient.position)],
        },
        instructions: {
          columns: { name: true, step: true },
          orderBy: [asc(recipeInstruction.position)],
        },
        dietaryTags: { columns: { tag: true } },
      },
    });
    return (
      data && {
        ...data,
        dietaryTags: data.dietaryTags.map(({ tag }) => tag),
      }
    );
  },
  ["public-recipe"],
  { revalidate: 60, tags: ["public-recipes"] },
);

export const recipeRouter = router({
  getAll: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          category: z.string().optional(),
          difficulty: z.string().optional(),
          dietaryTag: z.string().optional(),
          maxMinutes: z.number().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      return getPublicRecipesCached(input);
    }),
  getAllMY: protectedProcedure.query(async ({ ctx }) => {
    const email = await getRequiredUserEmail(ctx);
    return await ctx.db.query.recipe.findMany({
      where: eq(recipe.owner, email),
      orderBy: [desc(recipe.rating)],
      columns: recipeListColumns,
    });
  }),
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      return getPublicRecipeCached(input.id);
    }),
  createRecipe: protectedProcedure
    .input(recipeValidator)
    .mutation(async ({ ctx, input }) => {
      const email = await getRequiredUserEmail(ctx);
      const createdRecipe = await ctx.db.transaction(async (tx) => {
        const [created] = await tx
          .insert(recipe)
          .values({
            name: input.name,
            rating: 0,
            description: input.description,
            imageUrl: input.imageUrl || null,
            prepTimeMinutes: input.prepTimeMinutes,
            cookTimeMinutes: input.cookTimeMinutes,
            servings: input.servings,
            difficulty: input.difficulty,
            cuisine: input.cuisine,
            category: input.category,
            owner: email,
          })
          .returning();
        if (!created) return created;
        await tx.insert(recipeIngredient).values(
          input.ingredients.map((item, position) => ({
            recipeId: created.id,
            position,
            ...item,
          })),
        );
        await tx.insert(recipeInstruction).values(
          input.instructions.map((item, position) => ({
            recipeId: created.id,
            position,
            ...item,
          })),
        );
        const tags = [...new Set(input.dietaryTags)];
        if (tags.length) {
          await tx
            .insert(recipeDietaryTag)
            .values(tags.map((tag) => ({ recipeId: created.id, tag })));
        }
        return created;
      });
      if (!createdRecipe) {
        throw new Error("Failed to create recipe");
      }
      revalidateTag("public-recipes", "max");
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
        revalidateTag("public-recipes", "max");
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
        revalidateTag("public-recipes", "max");
        return true;
      }
    }),
});
