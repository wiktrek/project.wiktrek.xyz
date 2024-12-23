import { z } from "zod";
export const recipeValidator = z.object({
  name: z.string().min(5).max(256),
  description: z.string().min(5).max(512),
  ingredients: z
    .array(
      z.object({ ingredient: z.string().min(2).max(128), amount: z.number() }),
    )
    .min(1)
    .max(200),
  instructions: z
    .array(
      z.object({
        name: z.string().min(1).max(128),
        step: z.string().min(1).max(512),
      }),
    )
    .min(1)
    .max(200),
});

export type recipeInputType = z.infer<typeof recipeValidator>;
