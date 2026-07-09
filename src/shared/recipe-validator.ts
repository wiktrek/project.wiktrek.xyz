import { z } from "zod";

export const recipeValidator = z.object({
  name: z
    .string()
    .min(5, "Name must be at least 5 characters")
    .max(255, "Name must be 255 characters or fewer"),
  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(255, "Description must be 255 characters or fewer"),
  imageUrl: z
    .union([
      z.literal(""),
      z
        .string()
        .url("Enter a valid image URL")
        .max(2048, "Image URL must be 2048 characters or fewer"),
    ])
    .optional(),
  ingredients: z
    .array(
      z.object({
        ingredient: z
          .string()
          .min(2, "Ingredient must be at least 2 characters")
          .max(128, "Ingredient must be 128 characters or fewer"),
        amount: z
          .number({ message: "Enter a number" })
          .positive("Must be greater than 0"),
        amountType: z
          .string()
          .min(1, "Unit is required")
          .max(32, "Unit must be 32 characters or fewer"),
      }),
    )
    .min(1, "Add at least one ingredient")
    .max(200, "Add 200 ingredients or fewer"),
  instructions: z
    .array(
      z.object({
        name: z
          .string()
          .min(1, "Step name is required")
          .max(128, "Step name must be 128 characters or fewer"),
        step: z
          .string()
          .min(1, "Instruction is required")
          .max(512, "Instruction must be 512 characters or fewer"),
      }),
    )
    .min(1, "Add at least one instruction")
    .max(200, "Add 200 instructions or fewer"),
});

export type recipeInputType = z.infer<typeof recipeValidator>;
